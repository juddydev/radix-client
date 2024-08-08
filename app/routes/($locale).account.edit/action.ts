import type { CustomerUpdateInput } from "@shopify/hydrogen/customer-account-api-types"
import { type ActionFunction, json, redirect } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import { CUSTOMER_UPDATE_MUTATION } from "~/graphql/customer-account/customer-update-mutation"
import { formDataHas } from "~/routes/($locale).account.edit/utils/form-data-has"

/**
 * アカウント情報を更新する
 */
export const accountEditAction: ActionFunction = async ({
  request,
  context,
  params,
}) => {
  const formData = await request.formData()

  const isLoggedIn = await context.customerAccount.isLoggedIn()

  if (!isLoggedIn) {
    throw await context.customerAccount.logout()
  }

  try {
    const customer: CustomerUpdateInput = {}

    if (formDataHas(formData, "firstName")) {
      customer.firstName = formData.get("firstName") as string
    }

    if (formDataHas(formData, "lastName")) {
      customer.lastName = formData.get("lastName") as string
    }

    const { data, errors } = await context.customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      { variables: { customer } },
    )

    invariant(!errors?.length, errors?.[0]?.message)

    invariant(
      !data?.customerUpdate?.userErrors?.length,
      data?.customerUpdate?.userErrors?.[0]?.message,
    )

    return redirect(
      params?.locale ? `${params.locale}/account/address` : "/account/address",
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
