import { Link } from "@remix-run/react"
import { Money, flattenConnection } from "@shopify/hydrogen"
import type { OrderCardFragment } from "customer-accountapi.generated"
import { appConfig } from "~/app-config"
import { Separator } from "~/components/ui/separator"

type Props = {
  order: OrderCardFragment
}

/**
 * 注文履歴
 */
export function OrderCard(props: Props) {
  if (!props.order?.id) return null

  const idText = props.order?.id?.split("/").pop() ?? ""

  const lineItems = flattenConnection(props.order?.lineItems)

  const [fulfillments] = flattenConnection(props.order?.fulfillments)

  return (
    <div className="space-y-4">
      <div className="flex gap-x-8">
        <div className="space-x-4">
          <span className="opacity-60">{"ご注文日"}</span>
          <span>{"2025.10.10"}</span>
        </div>
        <div className="space-x-4">
          <span className="opacity-60">{"ご注文コード"}</span>
          <span>{`#${props.order.number}`}</span>
        </div>
        <div className="space-x-4">
          <span className="opacity-60">{"合計金額"}</span>
          <span>
            <Money className="inline" data={props.order.totalPrice} />
          </span>
        </div>
      </div>
      <Separator />
      {lineItems.map((lineItem) => (
        <div key={lineItem.title} className="flex">
          {/* {lineItem.image && (
            <Image
              width={168}
              height={168}
              className="fadeIn cover w-40"
              alt={lineItem.image?.altText ?? "Order image"}
              src={lineItem.image.url}
            />
          )} */}
          <div>
            <div>{lineItem.title}</div>
          </div>
        </div>
      ))}
      {appConfig.features.orderDetail && (
        <div className="flex">
          <Link
            className="underline"
            to={`/account/orders/${idText}`}
            prefetch="intent"
          >
            <p>{"注文詳細"}</p>
          </Link>
        </div>
      )}
    </div>
  )
}
