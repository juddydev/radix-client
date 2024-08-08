import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@shopify/remix-oxygen"

export async function loader({ params }: LoaderFunctionArgs) {
  const locale = params.locale

  return redirect(locale ? `/${locale}` : "/")
}

export async function action({ context }: ActionFunctionArgs) {
  return context.customerAccount.logout()
}
