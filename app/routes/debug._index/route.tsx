import { useLoaderData } from "@remix-run/react"
import { json, LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen"
import { shopifyApi, ApiVersion } from "@shopify/shopify-api"
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07"
import { Fragment } from "react/jsx-runtime"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

export async function loader(args: LoaderFunctionArgs) {
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

  const resp = await shopify.rest.Product.all({
    session: session,
  })

  const products = resp.data.map((product) => {
    if (!Array.isArray(product.options)) {
      throw new Error("product.options is undefined")
    }
    if (!Array.isArray(product.variants)) {
      throw new Error("product.options is undefined")
    }
    return {
      id: product.id,
      options: product.options.map((option) => {
        return {
          id: option.id as string,
          name: option.name as string,
          values: option.values as string[],
        }
      }),
      // biome-ignore lint/suspicious/noExplicitAny:
      variants: product.variants.map((variant: any) => {
        return {
          id: variant.id as string,
          title: variant.title as string,
          option1: variant.option1 as string,
          option2: variant.option2 as string,
          inventory_quantity: variant.inventory_quantity as number,
        }
      }),
    }
  })

  return json(products)
}

export default function Page() {
  const data = useLoaderData<typeof loader>()

  return (
    <Table className="overflow-x-auto text-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead>{"ID"}</TableHead>
          <TableHead>{"Option 1"}</TableHead>
          <TableHead>{"Option 2"}</TableHead>
          <TableHead>{"Variants"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            {product.options.map((option) => (
              <TableCell key={option.id}>
                <p>{option.name}</p>
              </TableCell>
            ))}
            {product.variants.map((variant) => (
              <Fragment key={variant.id}>
                <TableCell>
                  <p>{variant.title}</p>
                </TableCell>
                <TableCell>
                  <p>{variant.inventory_quantity}</p>
                </TableCell>
              </Fragment>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const meta: MetaFunction = () => {
  return [{ robots: "noindex" }]
}
