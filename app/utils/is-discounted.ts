import { MoneyV2 } from "@shopify/hydrogen/storefront-api-types"

export function isDiscounted(price: MoneyV2, compareAtPrice: MoneyV2) {
  if (compareAtPrice?.amount > price?.amount) {
    return true
  }
  return false
}
