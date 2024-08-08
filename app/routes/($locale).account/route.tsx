import { defer, Link, MetaArgs, Outlet, useLoaderData } from "@remix-run/react"
import {
  CacheNone,
  generateCacheControlHeader,
  getSeoMeta,
} from "@shopify/hydrogen"
import { LoaderFunctionArgs } from "@shopify/remix-oxygen"
import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import { Separator } from "~/components/ui/separator"
import { CUSTOMER_DETAILS_QUERY } from "~/graphql/customer-account/customer-details-query"
import { cn } from "~/lib/cn"
import { LogoutForm } from "~/routes/($locale).account/components/logout-button"
import { FEATURED_ITEMS_QUERY } from "~/routes/($locale).featured-products/graphql/featured-items-query"

export function meta(args: MetaArgs<typeof loader>) {
  return getSeoMeta({
    title: "アカウント",
  })
}

export default function AccountPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <main>
      <div className="container">
        <CustomBreadcrumb
          items={[
            { title: "マイページ", href: "/account" },
            { title: "ホーム", href: "/account" },
          ]}
        />
      </div>
      <header className="max-auto container max-w-screen-xl space-y-2 py-12">
        <h1 className={"text-4xl"}>{"MY PAGE"}</h1>
        <p className="text-sm opacity-40">{"マイページ"}</p>
      </header>
      <Separator className="hidden md:block" />
      <div
        className={cn(
          "max-auto container max-w-screen-xl pb-12 md:pt-12",
          "flex flex-col-reverse gap-8 md:flex-row lg:gap-x-16",
        )}
      >
        <nav className="w-full max-w-40">
          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/account">{"ホーム"}</Link>
            </li>
            <li>
              <Link to="/account/address">{"アカウント情報"}</Link>
            </li>
            <li>
              <Link to="/account/orders">{"注文履歴"}</Link>
            </li>
            <li>
              <div className="opacity-40">{"スキャンデータ"}</div>
            </li>
            <li>
              <div className="opacity-40">{"試着リスト"}</div>
            </li>
            <li>
              <div className="opacity-40">{"保存したコーディネート"}</div>
            </li>
            <li>
              <div className="opacity-40">{"保存したカスタマイズ"}</div>
            </li>
            <li>
              <div className="opacity-40">{"ポイント・クーポン"}</div>
            </li>
            <li>
              <div className="opacity-40">{"ご利用ガイド"}</div>
            </li>
            <li>
              <LogoutForm>
                <button type="submit">{"ログアウト"}</button>
              </LogoutForm>
            </li>
          </ul>
        </nav>
        <Outlet context={{ customer: data.customer }} />
      </div>
    </main>
  )
}

export async function loader(props: LoaderFunctionArgs) {
  const { data, errors } = await props.context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  )

  // 顧客情報の取得に失敗した場合はログアウトする
  if (errors?.length || !data?.customer) {
    throw await props.context.customerAccount.logout()
  }

  const customer = data?.customer

  const featuredDataPromise = await props.context.storefront.query(
    FEATURED_ITEMS_QUERY,
    {
      variables: {
        pageBy: 12,
        country: props.context.storefront.i18n.country,
        language: props.context.storefront.i18n.language,
      },
    },
  )

  return defer(
    {
      customer,
      featuredDataPromise: featuredDataPromise,
    },
    {
      headers: {
        "Cache-Control": generateCacheControlHeader(CacheNone()),
        "Set-Cookie": await props.context.session.commit(),
      },
    },
  )
}
