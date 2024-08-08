import { type CartReturn, flattenConnection, Money } from "@shopify/hydrogen"
import { TruckIcon } from "lucide-react"
import { CartLineItem } from "~/components/cart-line-item"
import { EmptyCartPage } from "~/components/empty-cart-page"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"

type Props = {
  cart: CartReturn | null
}

export function CartSection(props: Props) {
  const isEmpty = (props.cart?.lines?.edges?.length || 0) === 0

  if (props.cart === null || isEmpty) {
    return <EmptyCartPage />
  }

  const currentLines = props.cart.lines
    ? flattenConnection(props.cart.lines)
    : []
  return (
    <div className="max-auto container max-w-screen-lg space-y-16 py-12">
      <Card className="bg-cyan-800 text-white">
        <CardContent className="flex justify-center space-x-2 px-4 py-8">
          <TruckIcon style={{ transform: "scale(-1, 1)" }} />
          <span>{"ご注文はすべて送料無料でお届け"}</span>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-x-16 gap-y-8 lg:flex-row">
        <section className="flex-2 space-y-4">
          <p className="text-2xl">{"ご注文の商品"}</p>
          <ul className="grid gap-6 lg:gap-10">
            {currentLines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        </section>
        <Separator className="lg:hidden" />
        <section className="min-w-80 flex-1 space-y-4">
          <h3 className="text-2xl">{"ご注文の金額"}</h3>
          <dl className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <dt>{"小計"}</dt>
                <dd>
                  <Money data={props.cart.cost.subtotalAmount} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>{"クーポン"}</dt>
                <dd>{"0"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{"ポイント利用"}</dt>
                <dd>{"0pt"}</dd>
              </div>
              <Separator />
            </div>
            <div className="flex justify-between">
              <dt>{"合計"}</dt>
              <dd>
                <Money data={props.cart.cost.subtotalAmount} />
              </dd>
            </div>
          </dl>
          {!props.cart.checkoutUrl && (
            <Button disabled className="block w-full rounded-full">
              {"ご注文手続きに進む"}
            </Button>
          )}
          {props.cart.checkoutUrl && (
            <a className="block" href={props.cart.checkoutUrl} target="_self">
              <Button className="w-full rounded-full">
                {"ご注文手続きに進む"}
              </Button>
            </a>
          )}
        </section>
      </div>
    </div>
  )
}
