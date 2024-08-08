import { Form, Link } from "@remix-run/react"
import type { CustomerAddress } from "@shopify/hydrogen/customer-account-api-types"
import { Button } from "~/components/ui/button"

type Props = {
  address: CustomerAddress
  defaultAddress?: boolean
}

export function CustomerAddressCard(props: Props) {
  return (
    <div className="flex flex-col rounded border border-gray-200 p-6 lg:p-8">
      {props.defaultAddress && (
        <div className="mb-3 flex flex-row">
          <span className="rounded-full bg-primary/20 px-3 py-1 font-medium text-primary/50 text-xs">
            Default
          </span>
        </div>
      )}
      <ul className="flex-1 flex-row">
        {(props.address.firstName || props.address.lastName) && (
          <li>
            {`${props.address.firstName && `${props.address.firstName} `}
            ${props.address?.lastName}`}
          </li>
        )}
        {props.address.formatted?.map((line: string) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="mt-6 flex flex-row items-baseline font-medium">
        <Link
          to={`/account/address/${encodeURIComponent(props.address.id)}`}
          className="text-left text-sm underline"
          prefetch="intent"
        >
          Edit
        </Link>
        <Form action="address/delete" method="delete">
          <input type="hidden" name="addressId" value={props.address.id} />
          <Button>Remove</Button>
        </Form>
      </div>
    </div>
  )
}
