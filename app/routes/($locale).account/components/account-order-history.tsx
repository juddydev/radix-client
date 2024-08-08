import type { OrderCardFragment } from "customer-accountapi.generated"
import { EmptyOrders } from "~/routes/($locale).account/components/empty-orders"
import { OrderCard } from "~/routes/($locale).account/components/order-card"

type Props = {
  orders: OrderCardFragment[]
}

export function AccountOrderHistory(props: Props) {
  return (
    <div className="mt-6">
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h2 className="font-bold text-lead">Order History</h2>
        {props.orders.length === 0 && <EmptyOrders />}
        {props.orders.length !== 0 && (
          <ul className="false grid grid-flow-row grid-cols-1 gap-2 gap-y-6 sm:grid-cols-3 md:gap-4 lg:gap-6">
            {props.orders.map((order) => (
              <OrderCard order={order} key={order.id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
