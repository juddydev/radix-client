import type { LoaderFunctionArgs } from "@shopify/remix-oxygen"

export async function loader(props: LoaderFunctionArgs) {
  const { language, country } = props.context.storefront.i18n

  if (
    props.params.locale &&
    props.params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // 言語と国が一致しない場合は404を返す
    throw new Response(null, { status: 404 })
  }

  return null
}
