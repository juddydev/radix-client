import { Link } from "@remix-run/react"
import {
  CartForm,
  Image,
  OptimisticInput,
  useOptimisticData,
} from "@shopify/hydrogen"
import type {
  CartLine,
  ComponentizableCartLine,
} from "@shopify/hydrogen/storefront-api-types"
import { CartLineMoney } from "~/components/cart-line-money"
import { Separator } from "~/components/ui/separator"

type OptimisticData = {
  action?: string
  quantity?: number
}

type Props = {
  line: CartLine | ComponentizableCartLine
}

export function CartLineItem(props: Props) {
  const optimisticData = useOptimisticData<OptimisticData>(props.line.id)
  console.log("props", props)

  if (
    typeof props.line.quantity !== "number" ||
    !props.line.merchandise?.product
  ) {
    return null
  }

  return (
    <div
      className="flex flex-col space-y-4"
      style={{
        display: optimisticData?.action === "remove" ? "none" : "flex",
      }}
    >
      <div className="hidden space-y-2 md:block">
        <div className="flex flex-col md:flex-row">
          <div className="w-full">{"商品"}</div>
          <div className="w-40">{"数量"}</div>
          <div className="hidden w-40 md:block">{"価格"}</div>
        </div>
        <Separator />
      </div>
      <div className="flex">
        <div className="flex w-full gap-x-4">
          <div className="space-y-2">
            {props.line.merchandise.image && (
              <Image
                width={110}
                height={110}
                data={props.line.merchandise.image}
                className="h-28 w-28 rounded border object-cover object-center md:h-32 md:w-32"
                alt={props.line.merchandise.title}
              />
            )}
            <button type="submit" className="block hover:underline md:hidden">
              {"削除"}
            </button>
          </div>
          <div className="space-y-1">
            <div>
              {props.line.merchandise.product.handle ? (
                <Link to={`/products/${props.line.merchandise.product.handle}`}>
                  {props.line.merchandise?.product?.title || ""}
                </Link>
              ) : (
                <span>{props.line.merchandise?.product?.title || ""}</span>
              )}
              {props.line.attributes.length === 0
                ? (props.line.merchandise?.selectedOptions || []).map(
                    (option) => (
                      <p color="subtle" key={option.name}>
                        {option.name}: {option.value}
                      </p>
                    ),
                  )
                : (props.line.attributes || []).map((option) => (
                    <p color="subtle" key={option.key}>
                      {option.key}: {option.value}
                    </p>
                  ))}
            </div>
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesRemove}
              inputs={{
                lineIds: [props.line.id],
              }}
            >
              <button type="submit" className="hidden hover:underline md:block">
                {"削除"}
              </button>
              <OptimisticInput id={props.line.id} data={{ action: "remove" }} />
            </CartForm>
          </div>
        </div>
        <div className="hidden w-40 md:block">{props.line.quantity}</div>
        <div className="w-40">
          <CartLineMoney
            className="text-right md:text-left"
            line={props.line}
          />
        </div>
      </div>
    </div>
  )
}
