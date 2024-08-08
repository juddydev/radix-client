import { RemixServer } from "@remix-run/react"
import { createContentSecurityPolicy } from "@shopify/hydrogen"
import type { AppLoadContext, EntryContext } from "@shopify/remix-oxygen"
import { isbot } from "isbot"
import { renderToReadableStream } from "react-dom/server"

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    // shop: {
    //   checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
    //   storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    // },
  })

  let isError = false

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error)
        isError = true
      },
    },
  )

  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady
  }

  responseHeaders.set("Content-Type", "text/html")

  // Three.jsの機能と競合するので無効化
  // responseHeaders.set("Content-Security-Policy", header)

  return new Response(body, {
    headers: responseHeaders,
    status: isError ? 500 : responseStatusCode,
  })
}
