import { Money } from "@shopify/hydrogen"
import type {
  CartLine,
  ComponentizableCartLine,
} from "@shopify/hydrogen/storefront-api-types"

type Props = {
  className?: string
  line: CartLine | ComponentizableCartLine
  priceType?: "regular" | "compareAt"
}

export function CartLineMoney(props: Props) {
  if (!props.line?.cost?.amountPerQuantity || !props.line?.cost?.totalAmount) {
    return null
  }

  const priceType = props.priceType || "regular"

  const moneyV2 =
    priceType === "regular"
      ? props.line.cost.totalAmount
      : props.line.cost.compareAtAmountPerQuantity

  if (moneyV2 == null) {
    return null
  }

  return (
    <Money className={props.className} withoutTrailingZeros data={moneyV2} />
  )
}
