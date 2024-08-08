import { CartForm } from "@shopify/hydrogen"

type Props = {
  discountCodes?: string[]
  children: React.ReactNode
}

export function UpdateDiscountForm(props: Props) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: props.discountCodes || [],
      }}
    >
      {props.children}
    </CartForm>
  )
}
