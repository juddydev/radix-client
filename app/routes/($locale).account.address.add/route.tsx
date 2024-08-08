import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useOutletContext,
} from "@remix-run/react"
import { flattenConnection } from "@shopify/hydrogen"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { addAccountAddressAction } from "~/routes/($locale).account.address.add/action"
import { AccountOutletContext } from "~/routes/($locale).account/types/account-outlet-context"

export const action = addAccountAddressAction

type ActionData = {
  formError?: string
}

export default function AddAddress() {
  const isNewAddress = true

  const actionData = useActionData<ActionData>()

  const { state } = useNavigation()

  const { customer } = useOutletContext<AccountOutletContext>()

  const addresses = flattenConnection(customer.addresses)

  const defaultAddress = customer.defaultAddress

  /**
   * When a refresh happens (or a user visits this link directly), the URL
   * is actually stale because it contains a special token. This means the data
   * loaded by the parent and passed to the outlet contains a newer, fresher token,
   * and we don't find a match. We update the `find` logic to just perform a match
   * on the first (permanent) part of the ID.
   */
  const normalizedAddress = decodeURIComponent("").split("?")[0]

  const address = addresses.find((address) => {
    return address.id?.startsWith(normalizedAddress)
  })

  return (
    <div className="space-y-8 lg:space-y-16">
      <header className="space-y-1">
        <h1 className={"text-3xl"}>{"ACCOUNT"}</h1>
        <p className="text-sm opacity-40">
          {isNewAddress ? "お届け先の追加" : "お届け先の変更"}
        </p>
      </header>
      <div className="max-w-lg">
        <Form method="post" className="space-y-8">
          <div className="space-y-4">
            <Input type="hidden" name="addressId" value={"add"} />
            {actionData?.formError && (
              <div className="mb-6 flex items-center justify-center rounded bg-red-100">
                <p className="m-4 text-red-900 text-sm">
                  {actionData.formError}
                </p>
              </div>
            )}
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"苗字"}</div>
              <Input
                id="lastName"
                name="lastName"
                required
                type="text"
                autoComplete="family-name"
                placeholder={"苗字"}
                aria-label="Last name"
                defaultValue={address?.lastName ?? ""}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"名前"}</div>
              <Input
                id="firstName"
                name="firstName"
                required
                type="text"
                autoComplete="given-name"
                placeholder={"名前"}
                aria-label="First name"
                defaultValue={address?.firstName ?? ""}
              />
            </div>
            {/* <div>
              <Input
                id="territoryCode"
                name="territoryCode"
                type="text"
                autoComplete="country"
                placeholder="国"
                required
                aria-label="Country (Territory) Code"
                defaultValue={address?.territoryCode ?? ""}
              />
            </div> */}
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"郵便番号"}</div>
              <Input
                id="zip"
                name="zip"
                type="text"
                autoComplete="postal-code"
                placeholder="郵便番号"
                required
                aria-label="Zip"
                defaultValue={address?.zip ?? ""}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"都道府県"}</div>
              <Input
                id="zoneCode"
                name="zoneCode"
                type="text"
                autoComplete="address-level1"
                placeholder="都道府県"
                required
                aria-label="State / Province (zoneCode)"
                defaultValue={address?.zoneCode ?? ""}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"区市町村"}</div>
              <Input
                id="city"
                name="city"
                type="text"
                required
                autoComplete="address-level2"
                placeholder="区市町村"
                aria-label="City"
                defaultValue={address?.city ?? ""}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"住所1"}</div>
              <Input
                id="address1"
                name="address1"
                type="text"
                autoComplete="address-line1"
                placeholder="町名"
                required
                aria-label="Address line 1"
                defaultValue={address?.address1 ?? ""}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"住所2"}</div>
              <Input
                id="address2"
                name="address2"
                type="text"
                autoComplete="address-line2"
                placeholder="番地・号・アパート/建物名"
                aria-label="Address line 2"
                defaultValue={address?.address2 ?? ""}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"会社名"}</div>
              <Input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="会社名（任意）"
                aria-label="Company"
                defaultValue={address?.company ?? ""}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-24">{"電話番号"}</div>
              <Input
                id="phone"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="電話番号"
                aria-label="Phone"
                defaultValue={address?.phoneNumber ?? ""}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                name="defaultAddress"
                id="defaultAddress"
                defaultChecked={defaultAddress?.id === address?.id}
              />
              <label htmlFor="defaultAddress">
                {"デフォルトのお届け先に設定する"}
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <Button
              className={"w-full rounded-full"}
              type="submit"
              disabled={state !== "idle"}
            >
              {state !== "idle" ? "保存中.." : "保存"}
            </Button>
            <Link className="w-full" to="..">
              <Button className={"w-full rounded-full"} variant="secondary">
                {"キャンセル"}
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}
