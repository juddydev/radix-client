import { Await, defer, useLoaderData } from "@remix-run/react"
import {
  AnalyticsPageType,
  getSelectedProductOptions,
  Image,
  SeoConfig,
  getSeoMeta,
  ShopifyAnalyticsProduct,
} from "@shopify/hydrogen"
import { LoaderFunctionArgs, MetaArgs } from "@shopify/remix-oxygen"
import { Suspense, useState } from "react"
import invariant from "tiny-invariant"
import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import { Separator } from "~/components/ui/separator"
import { Skeleton } from "~/components/ui/skeleton"
import { ProductForm } from "~/routes/($locale).products.$handle._index/components/product-form"
import { ProductMaterialTable } from "~/routes/($locale).products.$handle._index/components/product-material-table"
import { PRODUCT_QUERY } from "~/routes/($locale).products.$handle._index/graphql/product-query"
import { VARIANTS_QUERY } from "~/routes/($locale).products.$handle._index/graphql/variants-query"
import { getRecommendedProducts } from "~/routes/($locale).products.$handle._index/utils/get-recommended-products"
import { redirectToFirstVariant } from "~/routes/($locale).products.$handle._index/utils/redirect-to-first-variant"
import { ProductBadge } from "~/routes/($locale).products._index/components/product-badge"
import { ProductCard } from "~/routes/($locale).products._index/components/product-card"
import { truncate } from "~/utils/truncate"

export function meta({ data }: MetaArgs<typeof loader>) {
  return getSeoMeta(data?.seoConfig)
}

export default function ProductPage() {
  const data = useLoaderData<typeof loader>()
  const [api, setApi] = useState<CarouselApi | undefined>()
  const [color, setColor] = useState("")

  const imageNodes = data.product.media.nodes.map((m) => {
    return m.__typename === "MediaImage" ? m.image ?? null : null
  })

  const filterColorNodes = imageNodes.filter((m) => {
    if (!m || !m.altText) return false
    const altTextColor = m.altText.split(".")[0]
    if (color === "" || undefined || null)
      return altTextColor === imageNodes[0]?.altText?.split(".")[0]
    return altTextColor === color
  })

  const onChangeColor = (col: string) => {
    setColor(col)
  }

  return (
    <main className="container pt-4">
      <CustomBreadcrumb
        items={[
          { title: "全てのアイテム", href: "/products" },
          {
            title: data.product.title,
            href: `/products/${data.product.handle}`,
          },
        ]}
      />
      <section className="flex flex-col gap-4 sm:gap-8 md:flex-row">
        <div className="flex-1">
          <Carousel className="relative w-full" setApi={setApi}>
            <CarouselContent>
              {filterColorNodes.map((image, i) => {
                if (image === null) return null
                return (
                  <CarouselItem key={image.id}>
                    <div>
                      <Image
                        loading={i === 0 ? "eager" : "lazy"}
                        data={{
                          ...image,
                          altText: image.id || "Product image",
                        }}
                        className="aspect-square h-full w-full object-cover"
                        sizes={"auto"}
                      />
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="left-4 border-none" />
            <CarouselNext className="right-4 border-none" />
          </Carousel>
          <div className="flex gap-x-4 overflow-x-scroll sm:grid-cols-4 md:grid md:overflow-x-visible lg:grid-cols-6">
            {filterColorNodes.map((image, i) => {
              if (image === null) return null
              return (
                <button
                  type="button"
                  key={image?.id}
                  onClick={() => {
                    api?.scrollTo(i)
                  }}
                  className="flex-shrink-0"
                >
                  <Image
                    loading={i === 0 ? "eager" : "lazy"}
                    data={image}
                    className="aspect-square h-full w-full object-cover"
                    sizes="20vw"
                  />
                </button>
              )
            })}
          </div>
        </div>
        <div className="w-full flex-1 space-y-8 md:max-w-xs">
          <div className="space-y-2">
            <ProductBadge type="NEW" />
            <div>
              {data.product.vendor && (
                <p className={"opacity-60"}>{data.product.vendor}</p>
              )}
              <h1 className="text-lg">{data.product.title}</h1>
            </div>
            <Suspense
              fallback={
                <ProductForm variants={[]} onChangeColor={onChangeColor} />
              }
            >
              <Await
                errorElement="There was a problem loading related products"
                resolve={data.variants}
              >
                {(resp) => (
                  <ProductForm
                    variants={resp.product?.variants.nodes || []}
                    onChangeColor={onChangeColor}
                  />
                )}
              </Await>
            </Suspense>
          </div>
          <Accordion type="multiple" defaultValue={["description", "material"]}>
            <Separator />
            {data.product.descriptionHtml && (
              <AccordionItem value="item-1">
                <AccordionTrigger>{"アイテム説明"}</AccordionTrigger>
                <AccordionContent>
                  <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                      __html: data.product.descriptionHtml,
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="material">
              <AccordionTrigger>{"素材"}</AccordionTrigger>
              <AccordionContent>
                <ProductMaterialTable />
              </AccordionContent>
            </AccordionItem>
            {/* <AccordionItem value="usage">
              <AccordionTrigger>{"お手入れ方法"}</AccordionTrigger>
              <AccordionContent>{"お手入れ方法の説明"}</AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </div>
      </section>
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={data.recommended}
        >
          {(products) => {
            return (
                <section className="pt-8">
                  <h2>{"関連商品"}</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:px-16">
                    {products.nodes.map((product) => (
                      <ProductCard product={product} key={product.id} />
                    ))}
                  </div>
                </section>
            )
          }}
        </Await>
      </Suspense>
    </main>
  )
}

export async function loader(props: LoaderFunctionArgs) {
  invariant(props.params.handle, "Missing handle param, check route filename")

  const selectedOptions = getSelectedProductOptions(props.request)

  const { shop, product } = await props.context.storefront.query(
    PRODUCT_QUERY,
    {
      variables: {
        handle: props.params.handle,
        selectedOptions,
        country: props.context.storefront.i18n.country,
        language: props.context.storefront.i18n.language,
      },
    },
  )

  if (!product?.id) {
    throw new Response("product", { status: 404 })
  }

  if (!product.selectedVariant) {
    throw redirectToFirstVariant({ product, request: props.request })
  }

  const variants = props.context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: props.params.handle,
      country: props.context.storefront.i18n.country,
      language: props.context.storefront.i18n.language,
    },
  })

  const recommended = getRecommendedProducts(
    props.context.storefront,
    product.id,
  )

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const [firstVariant] = product.variants.nodes

  const selectedVariant = product.selectedVariant ?? firstVariant

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  }

  const seoConfig = {
    title: product?.seo?.title ?? product?.title,
    description: truncate(
      product?.seo?.description ?? product?.description ?? "",
    ),
    media: selectedVariant?.image,
    // TODO: JsonLd
    // jsonLd: productJsonLd({ product, selectedVariant, url: props.request.url }),
  } satisfies SeoConfig

  return defer({
    seoConfig,
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: Number.parseFloat(selectedVariant.price.amount),
    },
  })
}
