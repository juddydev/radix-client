import type { LoaderFunctionArgs } from "@shopify/remix-oxygen"

/**
 * IMPORTANT: 増えてないか確認する
 * @see https://github.com/Shopify/hydrogen-demo-store/blob/main/app/routes/%5Brobots.txt%5D.tsx
 */
export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const sitemapUrl = url ? `${url}/sitemap.xml` : ""

  const value = text.replace("__URL__", sitemapUrl)

  return new Response(value, {
    status: 200,
    headers: {
      "content-type": "text/plain",
      "cache-control": `max-age=${60 * 60 * 24}`,
    },
  })
}

const text = `
User-agent: *
Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /account
Sitemap: __URL__

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders

User-agent: Pinterest
Crawl-delay: 1
`.trim()
