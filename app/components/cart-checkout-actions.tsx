import { Button } from "~/components/ui/button"

type Props = {
  checkoutUrl: string
}

export function CartCheckoutActions(props: Props) {
  if (!props.checkoutUrl) return null

  return (
    <div className="mt-2 flex flex-col">
      <a href={props.checkoutUrl} target="_self">
        <Button className="w-full">{"ご注文手続きに進む"}</Button>
      </a>
      {/* @todo: <CartShopPayButton cart={cart} /> */}
    </div>
  )
}
