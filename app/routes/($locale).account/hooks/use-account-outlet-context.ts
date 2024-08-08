import { useOutletContext } from "@remix-run/react"
import { Customer } from "@shopify/hydrogen/customer-account-api-types"

/**
 * アカウントのコンテキストを取得する
 */
export function useAccountOutletContext() {
  return useOutletContext<{ customer: Customer }>()
}
