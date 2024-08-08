import styles from "~/app.css?url"

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
  type ShouldRevalidateFunction,
} from "@remix-run/react"
import {
  getSeoMeta,
  useNonce,
  SeoConfig,
  getShopAnalytics,
} from "@shopify/hydrogen"
import {
  type LinksFunction,
  type LoaderFunctionArgs,
  MetaArgs,
  defer,
} from "@shopify/remix-oxygen"
import { GenericError } from "~/components/generic-error"
import { RouteError } from "~/components/route-error"
import { SHOP_QUERY } from "~/routes/($locale)/graphql/shop-query"
import { Fragment } from "react"
import { RootHeader } from "~/components/root-header"
import { RootFooter } from "~/components/root-footer"
import { DEFAULT_LOCALE } from "~/lib/default-locale"

type Props = {
  children: React.ReactNode
}

export function Layout(props: Props) {
  const nonce = useNonce()

  const data = useRouteLoaderData<typeof loader>("root")

  const locale = data?.selectedLocale ?? DEFAULT_LOCALE

  return (
    <html lang={locale.language} className="overflow-y-auto overscroll-none">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {process.env.NODE_ENV !== "development" && (
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html:
                "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KBR6MHWJ');",
            }}
          />
        )}
        {process.env.NODE_ENV !== "development" && (
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-XLZHDH3PVC"
          />
        )}
        {process.env.NODE_ENV !== "development" && (
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html:
                "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date()); gtag('config', 'G-XLZHDH3PVC');",
            }}
          />
        )}
      </head>
      <body className="font-sans text-neutral-700">
        {process.env.NODE_ENV !== "development" && (
          <noscript>
            <iframe
              title="googletagmanager"
              src="https://www.googletagmanager.com/ns.html?id=GTM-KBR6MHWJ"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {data ? (
          // <Analytics.Provider
          //   cart={data.cart}
          //   shop={data.shop}
          //   consent={data.consent}
          // >
          //   <RootLayout
          //     key={`${locale.language}-${locale.country}`}
          //     layout={data.layout}
          //   >
          //     {props.children}
          //   </RootLayout>
          // </Analytics.Provider>
          <Fragment key={`${locale.language}-${locale.country}`}>
            <RootHeader />
            {props.children}
            <RootFooter />
          </Fragment>
        ) : (
          props.children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

/**
 * エラー画面
 */
export function ErrorBoundary(props: { error: Error }) {
  const routeError = useRouteError()

  const isRouteError = isRouteErrorResponse(routeError)

  if (isRouteError) {
    return <RouteError error={routeError} />
  }

  return (
    <GenericError
      error={props.error instanceof Error ? props.error : undefined}
    />
  )
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "icon", type: "image/png", href: "/favicon.png" },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Noto+Sans+JP:wght@100..900&display=swap",
      rel: "stylesheet",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
  ]
}

export const meta = (props: MetaArgs<typeof loader>) => {
  return getSeoMeta(props.data?.seoConfig)
}

export async function loader({ context }: LoaderFunctionArgs) {
  const shopQuery = await context.storefront.query(SHOP_QUERY, {
    variables: {
      language: context.storefront.i18n.language,
    },
  })

  const seoConfig = {
    title: shopQuery.shop.name,
    titleTemplate: "%s | UNINOVERSE",
    description: shopQuery.shop.description ?? "",
    handle: "@shopify",
    url: shopQuery.shop.primaryDomain.url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    // TODO: JsonLd
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: shopQuery.shop.name,
      logo: shopQuery.shop.brand?.logo?.image?.url,
      sameAs: [
        "https://twitter.com/shopify",
        "https://facebook.com/shopify",
        "https://instagram.com/shopify",
        "https://youtube.com/shopify",
        "https://tiktok.com/@shopify",
      ],
      url: shopQuery.shop.primaryDomain.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${shopQuery.shop.primaryDomain.url}search?q={search_term}`,
        query: "required name='search_term'",
      },
    },
  } satisfies SeoConfig

  return defer({
    seoConfig: seoConfig,
    isLoggedIn: context.customerAccount.isLoggedIn(),
    cart: context.cart.get(),
    shop: getShopAnalytics({
      storefront: context.storefront,
      publicStorefrontId: context.env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: context.env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    selectedLocale: context.storefront.i18n,
  })
}

/**
 * This is important to avoid re-fetching root queries on sub-navigation
 */
export const shouldRevalidate: ShouldRevalidateFunction = (props) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (props.formMethod && props.formMethod !== "GET") {
    return true
  }

  // revalidate when manually revalidating via useRevalidator
  if (props.currentUrl.toString() === props.nextUrl.toString()) {
    return true
  }

  return false
}
