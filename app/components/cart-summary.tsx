import { Money } from "@shopify/hydrogen"
import type { CartCost } from "@shopify/hydrogen/storefront-api-types"

type Props = {
  children?: React.ReactNode
  cost: CartCost
}

export function CartSummary(props: Props) {
  return (
    <section>
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          <dt>Subtotal</dt>
          <dd>
            {props.cost?.subtotalAmount?.amount ? (
              <Money data={props.cost?.subtotalAmount} />
            ) : (
              "-"
            )}
          </dd>
        </div>
      </dl>
      {props.children}
    </section>
  )
}
