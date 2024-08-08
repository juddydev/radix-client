import { Await, Form, Link, useLoaderData } from "@remix-run/react"
import {
  getPaginationVariables,
  getSeoMeta,
  Pagination,
  SeoConfig,
} from "@shopify/hydrogen"
import { defer, LoaderFunctionArgs, MetaArgs } from "@shopify/remix-oxygen"
import { Suspense } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { PAGINATION_SIZE } from "~/lib/const"
import { getImageLoadingPriority } from "~/lib/get-image-loading-priority"
import { FEATURED_ITEMS_QUERY } from "~/routes/($locale).featured-products/graphql/featured-items-query"
import { ProductCard } from "~/routes/($locale).products._index/components/product-card"
import { NoResults } from "~/routes/($locale).search/components/no-results"
import { SEARCH_QUERY } from "~/routes/($locale).search/graphql/search-query"

export function meta(props: MetaArgs<typeof loader>) {
  return getSeoMeta(props.data?.seoConfig)
}

export default function SearchPage() {
  const data = useLoaderData<typeof loader>()

  const noResults = data.products?.nodes?.length === 0

  return (
    <main className="container space-y-4 pt-4">
      <header>
        <h1>{"検索結果"}</h1>
      </header>
      <Form method="get">
        <div className="flex gap-x-2">
          <Input name="q" placeholder="Search…" type="search" />
          <Button type="submit">{"検索"}</Button>
        </div>
      </Form>
      {noResults && data.searchTerm && (
        <NoResults>
          <Suspense>
            <Await
              errorElement="There was a problem loading related products"
              resolve={data.noResultRecommendations}
            >
              {(result) => {
                if (!result) return null
                return (
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:px-16">
                    {result.featuredProducts.nodes.map((product, i) => (
                      <li key={product.id}>
                        <Link to={`/products/${product.handle}`}>
                          <ProductCard
                            product={product}
                            loading={getImageLoadingPriority(i)}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )
              }}
            </Await>
          </Suspense>
        </NoResults>
      )}
      {!noResults && (
        <Pagination connection={data.products}>
          {(context) => {
            return (
              <section className="space-y-4">
                <context.PreviousLink className="block">
                  <Button className="w-full" variant={"secondary"}>
                    {context.isLoading ? "Loading..." : "Previous"}
                  </Button>
                </context.PreviousLink>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:px-16">
                  {context.nodes.map((product, i) => (
                    <li key={product.id}>
                      <Link to={`/products/${product.handle}`}>
                        <ProductCard
                          product={product}
                          loading={getImageLoadingPriority(i)}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <context.NextLink className="block">
                  <Button className="w-full" variant={"secondary"}>
                    {context.isLoading ? "読み込み中..." : "もっと見る"}
                  </Button>
                </context.NextLink>
              </section>
            )
          }}
        </Pagination>
      )}
    </main>
  )
}

export async function loader(props: LoaderFunctionArgs) {
  const searchParams = new URL(props.request.url).searchParams

  const searchTerm = searchParams.get("q")

  const variables = getPaginationVariables(props.request, {
    pageBy: PAGINATION_SIZE,
  })

  const data = await props.context.storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      ...variables,
      country: props.context.storefront.i18n.country,
      language: props.context.storefront.i18n.language,
    },
  })

  const shouldGetRecommendations =
    !searchTerm || data.products?.nodes?.length === 0

  const seoConfig = {
    title: searchTerm,
    description: `${searchTerm}$の検索結果`,
    titleTemplate: "%s | 検索結果",
    // TODO: JsonLd
    // jsonLd: collectionJsonLd({ collection, url: request.url }),
  } satisfies SeoConfig

  const noResultRecommendations = shouldGetRecommendations
    ? props.context.storefront.query(FEATURED_ITEMS_QUERY, {
        variables: {
          pageBy: 8,
          country: props.context.storefront.i18n.country,
          language: props.context.storefront.i18n.language,
          ...variables,
        },
      })
    : Promise.resolve(null)

  return defer({
    seoConfig,
    searchTerm,
    products: data.products,
    noResultRecommendations: noResultRecommendations,
  })
}
