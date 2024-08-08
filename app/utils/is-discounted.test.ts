import { expect, it } from "bun:test"

import { MoneyV2 } from "@shopify/hydrogen/storefront-api-types"

import { isDiscounted } from "~/utils/is-discounted"

const moneyA: MoneyV2 = { amount: "10", currencyCode: "JPY" as const }

it("should return true if compareAtPrice is greater than price", () => {
  const moneyB: MoneyV2 = { amount: "15", currencyCode: "JPY" as const }
  const result = isDiscounted(moneyA, moneyB)
  expect(result).toBe(true)
})

it("should return false if compareAtPrice is less than price", () => {
  const moneyB: MoneyV2 = { amount: "10", currencyCode: "JPY" as const }
  const result = isDiscounted(moneyA, moneyB)
  expect(result).toBe(false)
})
