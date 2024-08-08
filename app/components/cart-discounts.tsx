import type { Cart as CartType } from "@shopify/hydrogen/storefront-api-types"
import { Button } from "~/components/ui/button"
import { UpdateDiscountForm } from "~/components/update-discount-form"
import { cn } from "~/lib/cn"

type Props = {
  discountCodes: CartType["discountCodes"]
}

/**
 * Temporary discount UI
 * @param discountCodes the current discount codes applied to the cart
 * @todo rework when a design is ready
 */
export function CartDiscounts(props: Props) {
  const codes: string[] =
    props.discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map((discount) => discount.code) || []

  return (
    <>
      {/* Have existing discount, display it with a remove option */}
      <dl className={codes && codes.length !== 0 ? "grid" : "hidden"}>
        <div className="flex items-center justify-between font-medium">
          <dt>Discount(s)</dt>
          <div className="flex items-center justify-between">
            <UpdateDiscountForm>
              <Button>{"削除"}</Button>
            </UpdateDiscountForm>
            <dd>{codes?.join(", ")}</dd>
          </div>
        </div>
      </dl>
      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div
          className={cn("flex", "items-center justify-between gap-4 text-copy")}
        >
          <input type="text" name="discountCode" placeholder="Discount code" />
          <Button className="flex justify-end whitespace-nowrap font-medium">
            Apply Discount
          </Button>
        </div>
      </UpdateDiscountForm>
    </>
  )
}
