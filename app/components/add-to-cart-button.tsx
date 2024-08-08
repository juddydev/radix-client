import type { FetcherWithComponents } from "@remix-run/react"
import { CartForm } from "@shopify/hydrogen"
import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types"
import { appConfig } from "~/app-config"
import { Button } from "~/components/ui/button"

type Props = {
  children: React.ReactNode
  lines: CartLineInput[]
  disabled?: boolean
  analytics?: unknown
}

export function AddToCartButton(props: Props) {
  if (!appConfig.features.cart) {
    return (
      <Button className={"w-full"} disabled={true}>
        {props.children}
      </Button>
    )
  }

  return (
    <CartForm
      route="/cart"
      inputs={{ lines: props.lines }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<never>) => {
        return (
          <Button
            className={"w-full"}
            disabled={props.disabled ?? fetcher.state !== "idle"}
          >
            {props.children}
          </Button>
        )
      }}
    </CartForm>
  )
}
