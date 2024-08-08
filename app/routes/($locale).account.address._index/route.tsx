import { Form, Link } from "@remix-run/react"
import { flattenConnection } from "@shopify/hydrogen"
import { PlusIcon } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { useAccountOutletContext } from "~/routes/($locale).account/hooks/use-account-outlet-context"

/**
 * アカウント > アカウント情報
 */
export default function AccountAddressIndexPage() {
  const context = useAccountOutletContext()

  const addresses = flattenConnection(context.customer.addresses)

  return (
    <div className="space-y-8 lg:space-y-16">
      <header className="space-y-1">
        <h1 className={"text-3xl"}>{"ACCOUNT"}</h1>
        <p className="text-sm opacity-40">{"アカウント情報"}</p>
      </header>
      <section className="space-y-4">
        <div>{"アカウント情報"}</div>
        <Separator />
        <div className="flex justify-between gap-x-4">
          <span className="flex-1 opacity-40">{"氏名"}</span>
          <span className="flex-1">
            {context.customer.lastName
              ? `${context.customer.lastName} ${context.customer.firstName}`
              : "未登録"}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between gap-x-4">
          <span className="flex-1 opacity-40">{"メールアドレス"}</span>
          <span className="flex-1">
            {context.customer.emailAddress?.emailAddress ?? "未登録"}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between gap-x-4">
          <span className="flex-1 opacity-40">{"電話番号"}</span>
          <span className="flex-1">
            {context.customer.phoneNumber?.phoneNumber ?? "未登録"}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between gap-x-4">
          <span className="flex-1 opacity-40">{"生年月日"}</span>
          <span className="flex-1">{"未登録"}</span>
        </div>
        <Separator />
        <div>
          <Link to="/account/edit">
            <Button variant={"outline"} className="rounded-full px-8">
              {"編集"}
            </Button>
          </Link>
        </div>
      </section>
      <section className="space-y-4">
        <div>
          <div>{"お届け先情報"}</div>
          <div className="text-xs opacity-40">{`現在の登録件数 ${addresses.length}件`}</div>
        </div>
        <Separator />
        {addresses.length === 0 && (
          <p>{"まだお届け先が登録されていません。"}</p>
        )}
        {addresses.map((address, index) => (
          <Fragment key={address.id}>
            <div className="space-y-2">
              <div>{`お届け先${index + 1}`}</div>
              <p>{address.formatted.join(" ")}</p>
              <div className="flex gap-x-2">
                <Link to={`/account/address/${encodeURIComponent(address.id)}`}>
                  <Button variant={"outline"} className="rounded-full px-8">
                    {"編集"}
                  </Button>
                </Link>
                <Form action="/account/address/delete" method="delete">
                  <input type="hidden" name="addressId" value={address.id} />
                  <Button variant={"secondary"} className="rounded-full px-8">
                    {"削除"}
                  </Button>
                </Form>
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
        <div className="flex justify-end">
          <div className="border-b-2 pb-1">
            <Link className="flex items-center" to="/account/address/add">
              {"お届け先を追加する"}
              <PlusIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
