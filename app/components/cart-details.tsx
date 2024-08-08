import type { Cart as CartType } from "@shopify/hydrogen/storefront-api-types"
import { CartCheckoutActions } from "~/components/cart-checkout-actions"
import { CartDiscounts } from "~/components/cart-discounts"
import { CartLines } from "~/components/cart-lines"
import { CartSummary } from "~/components/cart-summary"

type Props = {
  cart: CartType | null
}

export function CartDetails(props: Props) {
  // @todo: get optimistic cart cost
  const cartHasItems = !!props.cart && props.cart.totalQuantity > 0

  return (
    <div>
      <CartLines lines={props.cart?.lines} />
      {cartHasItems && props.cart && (
        <CartSummary cost={props.cart.cost}>
          <CartDiscounts discountCodes={props.cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={props.cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  )
}
