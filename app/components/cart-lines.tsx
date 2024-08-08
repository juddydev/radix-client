import { flattenConnection } from "@shopify/hydrogen"
import type {
  CartLine,
  Cart as CartType,
} from "@shopify/hydrogen/storefront-api-types"
import { CartLineItem } from "~/components/cart-line-item"

type Props = {
  lines: CartType["lines"] | undefined
}

export function CartLines(props: Props) {
  const currentLines = props.lines ? flattenConnection(props.lines) : []

  return (
    <section>
      <ul className="grid gap-6 md:gap-10">
        {currentLines.map((line) => (
          <CartLineItem key={line.id} line={line as CartLine} />
        ))}
      </ul>
    </section>
  )
}
