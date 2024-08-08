import { CartForm, OptimisticInput } from "@shopify/hydrogen"
import type { CartLine } from "@shopify/hydrogen/storefront-api-types"

type Props = {
  lineId: CartLine["id"]
}

export function ItemRemoveButton(props: Props) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [props.lineId],
      }}
    >
      <button type="submit" className="hover:underline">
        {"削除"}
      </button>
      <OptimisticInput id={props.lineId} data={{ action: "remove" }} />
    </CartForm>
  )
}
