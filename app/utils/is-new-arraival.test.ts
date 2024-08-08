import { expect, it } from "bun:test"

import { isNewArrival } from "~/utils/is-new-arraival"

it("should return true if the date is within the specified number of days", () => {
  const currentDate = new Date().toISOString()
  const pastDate = new Date()
  pastDate.setDate(pastDate.getDate() - 15)
  const result = isNewArrival(pastDate.toISOString(), 30)
  expect(result).toBe(true)
})

it("should return false if the date is older than the specified number of days", () => {
  const currentDate = new Date().toISOString()
  const pastDate = new Date()
  pastDate.setDate(pastDate.getDate() - 45)
  const result = isNewArrival(pastDate.toISOString(), 30)
  expect(result).toBe(false)
})
