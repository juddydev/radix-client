import { CartForm } from "@shopify/hydrogen"
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types"

type Props = {
  children: React.ReactNode
  lines: CartLineUpdateInput[]
}

export function UpdateCartButton(props: Props) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines: props.lines,
      }}
    >
      {props.children}
    </CartForm>
  )
}
