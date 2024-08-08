import type { CustomerAddressInput } from "@shopify/hydrogen/customer-account-api-types"
import { type ActionFunction, json, redirect } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import { CREATE_ADDRESS_MUTATION } from "~/graphql/customer-account/customer-address-mutations"

export const addAccountAddressAction: ActionFunction = async ({
  request,
  context,
  params,
}) => {
  if (request.method !== "POST") {
    return json({ formError: "ERROR" }, { status: 400 })
  }

  const isLoggedIn = await context.customerAccount.isLoggedIn()

  if (!isLoggedIn) {
    throw await context.customerAccount.logout()
  }

  const formData = await request.formData()

  const address: CustomerAddressInput = {
    territoryCode: "JP",
  }

  type InputFields = keyof CustomerAddressInput

  const keys: InputFields[] = [
    "lastName",
    "firstName",
    "address1",
    "address2",
    "city",
    "zoneCode",
    // "territoryCode",
    "zip",
    "phoneNumber",
    "company",
  ]

  for (const key of keys) {
    const value = formData.get(key)
    if (typeof value !== "string") continue
    address[key] = value
  }

  const isDefaultAddress = formData.has("defaultAddress")
    ? String(formData.get("defaultAddress")) === "on"
    : false

  try {
    const { data, errors } = await context.customerAccount.mutate(
      CREATE_ADDRESS_MUTATION,
      { variables: { address, defaultAddress: isDefaultAddress } },
    )

    invariant(!errors?.length, errors?.[0]?.message)

    invariant(
      !data?.customerAddressCreate?.userErrors?.length,
      data?.customerAddressCreate?.userErrors?.[0]?.message,
    )

    invariant(
      data?.customerAddressCreate?.customerAddress?.id,
      "Expected customer address to be created",
    )

    return redirect(
      params?.locale ? `${params?.locale}/account/address` : "/account/address",
      {
        headers: {
          "Set-Cookie": await context.session.commit(),
        },
      },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined
    return json(
      { formError: message },
      {
        status: 400,
        headers: {
          "Set-Cookie": await context.session.commit(),
        },
      },
    )
  }
}
