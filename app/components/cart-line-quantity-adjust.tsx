import { OptimisticInput, useOptimisticData } from "@shopify/hydrogen"
import type { CartLine } from "@shopify/hydrogen/storefront-api-types"
import { UpdateCartButton } from "~/components/update-cart-button"

type OptimisticData = {
  action?: string
  quantity?: number
}

type Props = {
  line: CartLine
}

export function CartLineQuantityAdjust({ line }: Props) {
  const optimisticId = line?.id

  const optimisticData = useOptimisticData<OptimisticData>(optimisticId)

  if (!line || typeof line?.quantity === "undefined") return null

  const optimisticQuantity = optimisticData?.quantity || line.quantity

  const { id: lineId } = line

  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0))

  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0))

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex items-center rounded border">
        <UpdateCartButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            type={"submit"}
            name="decrease-quantity"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1}
          >
            <span>&#8722;</span>
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: prevQuantity }}
            />
          </button>
        </UpdateCartButton>

        <div className="px-2 text-center" data-test="item-quantity">
          {optimisticQuantity}
        </div>
        <UpdateCartButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button type={"submit"} name="increase-quantity" value={nextQuantity}>
            <span>&#43;</span>
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: nextQuantity }}
            />
          </button>
        </UpdateCartButton>
      </div>
    </>
  )
}
