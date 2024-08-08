import { Await } from "@remix-run/react"
import { CartSection } from "~/components/cart-section"
import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import { Separator } from "~/components/ui/separator"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { cartAction } from "~/routes/($locale).cart/action"

export const action = cartAction

// export async function loader(props: LoaderFunctionArgs) {
//   const data = await props.context.cart.get()

//   return json(data)
// }

export default function CartRoute() {
  const rootData = useRootLoaderData()

  return (
    <main>
      <div className="container">
        <CustomBreadcrumb items={[{ title: "カート", href: "/cart" }]} />
      </div>
      <header className="max-auto container max-w-screen-xl space-y-2 py-12">
        <h1 className={"text-4xl"}>{"CART"}</h1>
        <p className="text-sm opacity-40">{"カート"}</p>
      </header>
      <Separator />
      <Await resolve={rootData.cart}>
        {(cart) => <CartSection cart={cart} />}
      </Await>
    </main>
  )
}
