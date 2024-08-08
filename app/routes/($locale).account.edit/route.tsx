import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useOutletContext,
} from "@remix-run/react"
import type { Customer } from "@shopify/hydrogen/customer-account-api-types"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/cn"
import { accountEditAction } from "~/routes/($locale).account.edit/action"

export type AccountOutletContext = {
  customer: Customer
}

type ActionData = {
  success?: boolean
  formError?: string
  fieldErrors?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    currentPassword?: string
    newPassword?: string
    newPassword2?: string
  }
}

export const handle = {
  renderInModal: true,
}

export default function AccountDetailsEdit() {
  const actionData = useActionData<ActionData>()

  const { customer } = useOutletContext<AccountOutletContext>()

  const navigation = useNavigation()

  return (
    <div className="max-w-80 space-y-8">
      <header className="space-y-1">
        <h1 className={"text-3xl"}>{"ACCOUNT"}</h1>
        <p className="text-sm opacity-40">{"アカウント情報の変更"}</p>
      </header>
      <Form method="post" className="space-y-8">
        {actionData?.formError && (
          <div className="mb-6 flex items-center justify-center rounded bg-red-100">
            <p className="m-4 text-red-900 text-sm">{actionData.formError}</p>
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center gap-x-4">
            <span className="w-12">{"苗字"}</span>
            <Input
              className={cn({ "border-red-500": false })}
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="苗字"
              aria-label="Last name"
              defaultValue={customer.lastName ?? ""}
            />
          </div>
          <div className="flex items-center gap-x-4">
            <span className="w-12">{"名前"}</span>
            <Input
              className={cn({ "border-red-500": false })}
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="名前"
              aria-label="First name"
              defaultValue={customer.firstName ?? ""}
            />
          </div>
        </div>
        <div className={"flex gap-x-2"}>
          <Button
            className="rounded-full"
            type="submit"
            disabled={navigation.state !== "idle"}
          >
            {navigation.state !== "idle" ? "保存中.." : "保存"}
          </Button>
          <Link to={"/account/address"}>
            <Button className="rounded-full" variant="secondary">
              {"キャンセル"}
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  )
}

export const action = accountEditAction
