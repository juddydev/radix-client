import type { CustomerAddressInput } from "@shopify/hydrogen/customer-account-api-types"
import { type ActionFunction, json, redirect } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import {
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from "~/graphql/customer-account/customer-address-mutations"

export const accountAddressAction: ActionFunction = async ({
  request,
  context,
  params,
}) => {
  const formData = await request.formData()

  const isLoggedIn = await context.customerAccount.isLoggedIn()

  // Double-check current user is logged in.
  // Will throw a logout redirect if not.
  if (!isLoggedIn) {
    throw await context.customerAccount.logout()
  }

  const addressId = formData.get("addressId")

  invariant(typeof addressId === "string", "You must provide an address id.")

  if (request.method === "DELETE") {
    try {
      const { data, errors } = await context.customerAccount.mutate(
        DELETE_ADDRESS_MUTATION,
        { variables: { addressId } },
      )

      invariant(!errors?.length, errors?.[0]?.message)

      invariant(
        !data?.customerAddressDelete?.userErrors?.length,
        data?.customerAddressDelete?.userErrors?.[0]?.message,
      )

      return redirect(
        params?.locale
          ? `${params?.locale}/account/address`
          : "/account/address",
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
          headers: { "Set-Cookie": await context.session.commit() },
        },
      )
    }
  }

  const address: CustomerAddressInput = {
    territoryCode: "JP",
  }

  const keys: (keyof CustomerAddressInput)[] = [
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
    if (typeof value === "string") {
      address[key] = value
    }
  }

  const defaultAddress = formData.has("defaultAddress")
    ? String(formData.get("defaultAddress")) === "on"
    : false

  try {
    const { data, errors } = await context.customerAccount.mutate(
      UPDATE_ADDRESS_MUTATION,
      {
        variables: {
          address,
          addressId,
          defaultAddress,
        },
      },
    )

    invariant(!errors?.length, errors?.[0]?.message)

    invariant(
      !data?.customerAddressUpdate?.userErrors?.length,
      data?.customerAddressUpdate?.userErrors?.[0]?.message,
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
        headers: { "Set-Cookie": await context.session.commit() },
      },
    )
  }
}
