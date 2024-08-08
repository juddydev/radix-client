import { FulfillmentStatus } from "@shopify/hydrogen/customer-account-api-types"

export function statusMessage(status: FulfillmentStatus) {
  const translations: Record<FulfillmentStatus, string> = {
    SUCCESS: "Success",
    PENDING: "Pending",
    OPEN: "Open",
    FAILURE: "Failure",
    ERROR: "Error",
    CANCELLED: "Cancelled",
  }

  try {
    return translations?.[status]
  } catch (error) {
    return status
  }
}
