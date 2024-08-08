import { AccountProfile } from "~/routes/($locale).account/components/account-profile"
import { useAccountOutletContext } from "~/routes/($locale).account/hooks/use-account-outlet-context"

/**
 * アカウント > ホーム
 */
export default function AccountIndexPage() {
  const context = useAccountOutletContext()

  return (
    <AccountProfile
      lastName={context.customer.lastName ?? null}
      firstName={context.customer.firstName ?? null}
    />
  )
}
