import { useLoaderData } from "@remix-run/react"
import { getSeoMeta, SeoConfig } from "@shopify/hydrogen"
import { type LoaderFunctionArgs, MetaArgs, json } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import { PAGE_QUERY } from "~/routes/($locale).pages.$handle/graphql/page-query"
import { truncate } from "~/utils/truncate"

export function meta({ data }: MetaArgs<typeof loader>) {
  return getSeoMeta(data?.seoConfig)
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>()

  return (
    <main className="container space-y-4">
      <div
        className={"znc font-medium"}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </main>
  )
}

export async function loader(props: LoaderFunctionArgs) {
  invariant(props.params.handle, "Missing page handle")

  const { page } = await props.context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: props.params.handle,
      language: props.context.storefront.i18n.language,
    },
  })

  if (!page) {
    throw new Response(null, { status: 404 })
  }

  const seoConfig = {
    description: truncate(page?.seo?.description || ""),
    title: page?.seo?.title ?? page?.title,
    titleTemplate: "%s | Page",
    url: props.request.url,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
    },
  } satisfies SeoConfig

  return json({ seoConfig, page })
}
