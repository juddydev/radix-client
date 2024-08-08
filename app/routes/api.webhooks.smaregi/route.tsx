import "@shopify/shopify-api/adapters/cf-worker"

import { ApiVersion, shopifyApi } from "@shopify/shopify-api"
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07"
import { getSmaregiAccessToken } from "~/lib/get-smaregi-access-token"
import { smaregi } from "~/lib/smaregi"
import { ActionFunctionArgs } from "@shopify/remix-oxygen"

export async function loader() {
  return {}
}

export async function action(args: ActionFunctionArgs) {
  const loaderJson = await args.request.json()

  const smaregiEvent = loaderJson as {
    event: "pos:stock"
    ids: { productId: string }[]
  }

  const shopify = shopifyApi({
    apiSecretKey: args.context.env.PRIVATE_ADMIN_API_SECRET_KEY,
    apiVersion: ApiVersion.July24,
    isCustomStoreApp: true,
    adminApiAccessToken: args.context.env.PRIVATE_ADMIN_API_ACCESS_TOKEN,
    isEmbeddedApp: false,
    hostName: "localhost",
    restResources,
  })

  const session = shopify.session.customAppSession("fea8a5-ec.myshopify.com")

  if (smaregiEvent.event === "pos:stock") {
    const [id] = smaregiEvent.ids
    const accessToken = await getSmaregiAccessToken(
      args.context.env.PRIVATE_SMAREGI_API_TOKEN,
    )
    const resp = await smaregi[":id"].pos.products[":product"].$get({
      header: { authorization: `Bearer ${accessToken}` },
      param: { id: "skcr313b9", product: id.productId },
    })
    const smaregiProduct = await resp.json()
    const smaregiStocksResp = await smaregi[":id"].pos.stock.$get({
      header: { authorization: `Bearer ${accessToken}` },
      param: { id: "skcr313b9" },
      query: { product_id: id.productId },
    })
    const smaregiStocks = await smaregiStocksResp.json()
    const shopifyProductId = smaregiProduct.groupCode
    if (shopifyProductId === null) {
      throw new Error("Product not found")
    }
    const shopifyProduct = await shopify.rest.Product.find({
      session: session,
      id: shopifyProductId,
    })
    if (shopifyProduct === null) {
      throw new Error("Product not found")
    }
    if (!Array.isArray(shopifyProduct.variants)) {
      throw new Error("Product options is not an array")
    }
    for (const variant of shopifyProduct.variants) {
      // biome-ignore lint/suspicious/noExplicitAny:
      const anyVariant = variant as any
      const smaregiProductColor = smaregiProduct.color
        ?.toLocaleLowerCase()
        .replaceAll(" ", "-")
      const smaregiProductSize = smaregiProduct.size?.toLocaleLowerCase()
      if (
        anyVariant.option1 !== smaregiProductColor &&
        anyVariant.option2 !== smaregiProductColor
      ) {
        continue
      }
      if (
        anyVariant.option1 !== smaregiProductSize &&
        anyVariant.option2 !== smaregiProductSize
      ) {
        continue
      }
      console.log("variant", variant)
      const shopifyInventoryLevel = new shopify.rest.InventoryLevel({ session })
      for (const stock of smaregiStocks) {
        // 表参道
        if (stock.storeId === "1") {
          await shopifyInventoryLevel.set({
            location_id: 71842594999,
            inventory_item_id: anyVariant.inventory_item_id,
            available: stock.stockAmount,
          })
        }
        // 本社
        if (stock.storeId === "2") {
          await shopifyInventoryLevel.set({
            location_id: 69710676151,
            inventory_item_id: anyVariant.inventory_item_id,
            available: stock.stockAmount,
          })
        }
      }
    }
  }

  return {}
}
