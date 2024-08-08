import { type LoaderFunctionArgs, json } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import { FEATURED_ITEMS_QUERY } from "~/routes/($locale).featured-products/graphql/featured-items-query"

export async function loader(props: LoaderFunctionArgs) {
  const data = await props.context.storefront.query(FEATURED_ITEMS_QUERY, {
    variables: {
      pageBy: 12,
      country: props.context.storefront.i18n.country,
      language: props.context.storefront.i18n.language,
    },
  })

  invariant(data, "No featured items data returned from Shopify API")

  return json(data)
}
