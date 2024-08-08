import { Link, useLoaderData } from "@remix-run/react"
import {
  AnalyticsPageType,
  Pagination,
  SeoConfig,
  flattenConnection,
  getPaginationVariables,
  getSeoMeta,
} from "@shopify/hydrogen"
import { type LoaderFunctionArgs, MetaArgs, json } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import { Button } from "~/components/ui/button"
import { PAGINATION_SIZE } from "~/lib/const"
import { COLLECTION_QUERY } from "~/routes/($locale).collections.$handle/graphql/collection-query"
import { ProductCard } from "~/routes/($locale).products._index/components/product-card"
import { truncate } from "~/utils/truncate"

export function meta({ data }: MetaArgs<typeof loader>) {
  return getSeoMeta(data?.seoConfig)
}

export async function loader(props: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(props.request, {
    pageBy: PAGINATION_SIZE,
  })

  invariant(props.params.handle, "Missing params.handle param")

  const data = await props.context.storefront.query(COLLECTION_QUERY, {
    variables: {
      ...paginationVariables,
      handle: props.params.handle,
      filters: [],
      sortKey: "BEST_SELLING",
      reverse: false,
      country: props.context.storefront.i18n.country,
      language: props.context.storefront.i18n.language,
    },
  })

  if (!data.collection) {
    throw new Response("collection", { status: 404 })
  }

  const seoConfig = {
    title: data.collection?.seo?.title,
    description: truncate(
      data.collection?.seo?.description ?? data.collection?.description ?? "",
    ),
    titleTemplate: "%s | UNINOVERSE",
    media: {
      type: "image",
      url: data.collection?.image?.url,
      height: data.collection?.image?.height,
      width: data.collection?.image?.width,
      altText: data.collection?.image?.altText,
    },
    // TODO: JsonLd
    // jsonLd: collectionJsonLd({
    //   collection: data.collection,
    //   url: props.request.url,
    // }),
  } satisfies SeoConfig

  return json({
    seoConfig,
    collection: data.collection,
    collections: flattenConnection(data.collections),
    analytics: {
      pageType: AnalyticsPageType.collection,
      collectionHandle: data.collection.handle,
      resourceId: data.collection.id,
    },
  })
}

export default function Collection() {
  const data = useLoaderData<typeof loader>()

  return (
    <main className="container space-y-4 pt-4">
      <header>
        <h1>{data.collection.title}</h1>
        {data.collection?.description && <p>{data.collection.description}</p>}
      </header>
      <section>
        <Pagination connection={data.collection.products}>
          {(context) => (
            <>
              <context.PreviousLink>
                <Button variant="secondary">
                  {context.isLoading ? "Loading..." : "Load previous"}
                </Button>
              </context.PreviousLink>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:px-16">
                {context.nodes.map((product) => (
                  <Link key={product.id} to={`/products/${product.handle}`}>
                    <ProductCard product={product} key={product.id} />
                  </Link>
                ))}
              </ul>
              <context.NextLink>
                <Button variant="secondary">
                  {context.isLoading ? "Loading..." : "Load more products"}
                </Button>
              </context.NextLink>
            </>
          )}
        </Pagination>
      </section>
    </main>
  )
}
