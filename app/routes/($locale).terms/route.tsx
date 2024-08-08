import { useLoaderData } from "@remix-run/react"
import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import { Separator } from "~/components/ui/separator"
import { type LoaderFunctionArgs, MetaArgs, json } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import { POLICY_CONTENT_QUERY } from "~/routes/($locale).policies.$handle/components/policy-content-query"
import { getSeoMeta, SeoConfig } from "@shopify/hydrogen"
import { truncate } from "~/utils/truncate"

export function meta({ data }: MetaArgs<typeof loader>) {
  return getSeoMeta(data?.seoConfig)
}

/**
 * 利用規約
 */
export default function TermsPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <main>
      <div className="container">
        <CustomBreadcrumb items={[{ title: "利用規約", href: "/terms" }]} />
      </div>
      <header className="max-auto container max-w-screen-xl space-y-2 py-12">
        <h1 className={"text-4xl"}>{"TERMS"}</h1>
        <p className="text-sm opacity-40">{"利用規約"}</p>
      </header>
      <Separator />
      <div
        className={"html container my-8 max-w-2xl"}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: data.policy.body }}
      />
    </main>
  )
}

export async function loader(props: LoaderFunctionArgs) {
  const data = await props.context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: true,
      refundPolicy: false,
      language: props.context.storefront.i18n.language,
    },
  })

  invariant(data, "No data returned from Shopify API")

  const policy = data.shop.termsOfService

  invariant(policy, "No data returned from Shopify API")

  const seoConfig = {
    description: truncate(policy?.body ?? ""),
    title: policy?.title,
    titleTemplate: "%s | Policy",
    url: props.request.url,
  } satisfies SeoConfig

  return json({ seoConfig, policy })
}
