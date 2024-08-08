import { Link } from "@remix-run/react"
import type { CustomerAddress } from "@shopify/hydrogen/customer-account-api-types"
import type { CustomerDetailsFragment } from "customer-accountapi.generated"
import { Button } from "~/components/ui/button"
import { CustomerAddressCard } from "~/routes/($locale).account/components/customer-address-card"

type Props = {
  customer: CustomerDetailsFragment
  addresses: CustomerAddress[]
}

export function AccountAddressBook(props: Props) {
  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead">Address Book</h3>
        <div>
          {!props.addresses?.length && (
            <p className="mb-1">You haven&apos;t saved any addresses yet.</p>
          )}
          <div className="w-48">
            <Link to="address/add">
              <Button className="mt-2 mb-6 w-full text-sm" variant="secondary">
                Add an Address
              </Button>
            </Link>
          </div>
          {Boolean(props.addresses?.length) && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {props.customer.defaultAddress && (
                <CustomerAddressCard
                  address={props.customer.defaultAddress}
                  defaultAddress
                />
              )}
              {props.addresses
                .filter((address) => {
                  return address.id !== props.customer.defaultAddress?.id
                })
                .map((address) => (
                  <CustomerAddressCard key={address.id} address={address} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
