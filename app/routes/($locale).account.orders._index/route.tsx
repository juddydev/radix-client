import { flattenConnection } from "@shopify/hydrogen"
import { OrderCard } from "~/routes/($locale).account/components/order-card"
import { useAccountOutletContext } from "~/routes/($locale).account/hooks/use-account-outlet-context"

/**
 * アカウント > 注文履歴
 */
export default function AccountOrdersIndexPage() {
  const context = useAccountOutletContext()

  const orders = flattenConnection(context.customer.orders)

  return (
    <div className="space-y-8 lg:space-y-16">
      <header className="space-y-1">
        <h1 className={"text-3xl"}>{"ORDERS"}</h1>
        <p className="text-sm opacity-40">{"注文履歴"}</p>
      </header>
      {orders.length !== 0 && (
        <ul className="space-y-16">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
