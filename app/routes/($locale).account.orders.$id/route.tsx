import { Link, MetaArgs, useLoaderData } from "@remix-run/react"
import { Image, Money, flattenConnection, getSeoMeta } from "@shopify/hydrogen"
import { type LoaderFunctionArgs, json, redirect } from "@shopify/remix-oxygen"
import { CUSTOMER_ORDER_QUERY } from "~/graphql/customer-account/customer-order-query"
import { cn } from "~/lib/cn"
import { statusMessage } from "~/utils/status-message"

export function meta({ data }: MetaArgs<typeof loader>) {
  return getSeoMeta({
    title: `Order ${data?.order?.name}`,
  })
}

export async function loader(props: LoaderFunctionArgs) {
  if (!props.params.id) {
    return redirect(
      props.params?.locale ? `${props.params.locale}/account` : "/account",
    )
  }

  try {
    const orderId = `gid://shopify/Order/${props.params.id}`

    const { data, errors } = await props.context.customerAccount.query(
      CUSTOMER_ORDER_QUERY,
      { variables: { orderId } },
    )

    if (errors !== undefined || data.order === undefined) {
      throw new Error("Order not found")
    }

    if (data.order === null) {
      throw new Error("Order not found")
    }

    if (data.order.lineItems === undefined) {
      throw new Error("Order has no line items")
    }

    const lineItems = flattenConnection(data.order.lineItems)

    const discountApplications = flattenConnection(
      data.order.discountApplications,
    )

    const firstDiscount = discountApplications[0]?.value

    const discountValue =
      firstDiscount?.__typename === "MoneyV2" && firstDiscount

    const discountPercentage =
      firstDiscount?.__typename === "PricingPercentageValue" &&
      firstDiscount?.percentage

    const fulfillments = flattenConnection(data.order.fulfillments)

    console.log("fulfillments", fulfillments)

    const [fulfillment = null] = fulfillments

    const fulfillmentStatus = fulfillment?.status ?? null

    return json(
      {
        order: data.order,
        lineItems,
        discountValue,
        discountPercentage,
        fulfillmentStatus,
      },
      {
        headers: {
          "Set-Cookie": await props.context.session.commit(),
        },
      },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined
    throw new Response(message, {
      status: 404,
      headers: { "Set-Cookie": await props.context.session.commit() },
    })
  }
}

/**
 * アカウント
 */
export default function AccountOrdersPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <div>
        <Link to="/account">
          <p color="subtle">Return to Account Overview</p>
        </Link>
      </div>
      <div className="w-full p-6 sm:grid-cols-1 md:p-8 lg:p-12 lg:py-6">
        <div>
          <h3>Order No. {data.order.name}</h3>
          <p className="mt-2">
            Placed on {new Date(data.order.processedAt).toDateString()}
          </p>
          <div className="grid items-start gap-12 sm:grid-cols-1 sm:divide-y sm:divide-gray-200 md:grid-cols-4 md:gap-16">
            <table className="my-8 min-w-full divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr className="align-baseline">
                  <th
                    scope="col"
                    className="pr-3 pb-4 pl-0 text-left font-semibold"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 text-right font-semibold sm:table-cell md:table-cell"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 text-right font-semibold sm:table-cell md:table-cell"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-4 pb-4 text-right font-semibold"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.lineItems.map((lineItem) => (
                  <tr key={lineItem.id}>
                    <td className="w-full max-w-0 py-4 pr-3 pl-0 align-top sm:w-auto sm:max-w-none sm:align-middle">
                      <div className="flex gap-6">
                        {lineItem?.image && (
                          <div className="card-image aspect-square w-24">
                            <Image
                              data={lineItem.image}
                              width={96}
                              height={96}
                            />
                          </div>
                        )}
                        <div className="hidden flex-col justify-center lg:flex">
                          <p>{lineItem.title}</p>
                          <p className="mt-1">{lineItem.variantTitle}</p>
                        </div>
                        <dl className="grid">
                          <dt className="sr-only">Product</dt>
                          <dd className="truncate lg:hidden">
                            <h3>{lineItem.title}</h3>
                            <p className="mt-1">{lineItem.variantTitle}</p>
                          </dd>
                          <dt className="sr-only">Price</dt>
                          <dd className="truncate sm:hidden">
                            <p className="mt-4">
                              {lineItem.price ? (
                                <Money data={lineItem.price} />
                              ) : (
                                <span>{"エラー"}</span>
                              )}
                            </p>
                          </dd>
                          <dt className="sr-only">Quantity</dt>
                          <dd className="truncate sm:hidden">
                            <p className="mt-1">Qty: {lineItem.quantity}</p>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                      {lineItem.price ? (
                        <Money data={lineItem.price} />
                      ) : (
                        <span>{"エラー"}</span>
                      )}
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                      <p>
                        <Money data={lineItem.totalDiscount} />
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {(data.discountValue?.amount || data.discountPercentage) && (
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-6 pr-3 pl-6 text-right font-normal sm:table-cell md:pl-0"
                    >
                      <p>Discounts</p>
                    </th>
                    <th
                      scope="row"
                      className="pt-6 pr-3 text-left font-normal sm:hidden"
                    >
                      <p>Discounts</p>
                    </th>
                    <td className="pt-6 pr-4 pl-3 text-right font-medium text-green-700 md:pr-3">
                      {data.discountPercentage ? (
                        <span className="text-sm">
                          -{data.discountPercentage}% OFF
                        </span>
                      ) : (
                        data.discountValue && (
                          <Money data={data.discountValue} />
                        )
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-6 pr-3 pl-6 text-right font-normal sm:table-cell md:pl-0"
                  >
                    <p>Subtotal</p>
                  </th>
                  <th
                    scope="row"
                    className="pt-6 pr-3 text-left font-normal sm:hidden"
                  >
                    <p>Subtotal</p>
                  </th>
                  <td className="pt-6 pr-4 pl-3 text-right md:pr-3">
                    {data.order.subtotal ? (
                      <Money data={data.order.subtotal} />
                    ) : (
                      <span>{"エラー"}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pr-3 pl-6 text-right font-normal sm:table-cell md:pl-0"
                  >
                    Tax
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 text-left font-normal sm:hidden"
                  >
                    <p>Tax</p>
                  </th>
                  <td className="pt-4 pr-4 pl-3 text-right md:pr-3">
                    {data.order.totalTax ? (
                      <Money data={data.order.totalTax} />
                    ) : (
                      <span>{"エラー"}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pr-3 pl-6 text-right font-semibold sm:table-cell md:pl-0"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 text-left font-semibold sm:hidden"
                  >
                    <p>Total</p>
                  </th>
                  <td className="pt-4 pr-4 pl-3 text-right font-semibold md:pr-3">
                    <Money data={data.order.totalPrice} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="sticky top-nav border-none md:my-8">
              <h3 className="font-semibold">Shipping Address</h3>
              {data.order?.shippingAddress ? (
                <ul className="mt-6">
                  <li>
                    <p>{data.order.shippingAddress.name}</p>
                  </li>
                  {data.order?.shippingAddress?.formatted ? (
                    data.order.shippingAddress.formatted.map((line: string) => (
                      <li key={line}>
                        <p>{line}</p>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <p className="mt-3">No shipping address defined</p>
              )}
              <h3 className="mt-8 font-semibold">Status</h3>
              {data.fulfillmentStatus && (
                <div
                  className={cn(
                    "mt-3 inline-block w-auto rounded-full px-3 py-1 font-medium text-xs",
                    data.fulfillmentStatus === "SUCCESS"
                      ? "bg-green-100 text-green-800"
                      : "bg-primary/20 text-primary/50",
                  )}
                >
                  <p>{statusMessage(data.fulfillmentStatus)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
