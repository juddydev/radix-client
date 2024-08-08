import { Await, Link } from "@remix-run/react"
import { ShoppingCartIcon } from "lucide-react"
import { Suspense } from "react"
import { Button } from "~/components/ui/button"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

export function CartCount() {
  const rootData = useRootLoaderData()

  // <Badge count={0} />

  return (
    <Suspense
      fallback={
        <Button size={"icon"} variant={"ghost"} className="rounded-full">
          <ShoppingCartIcon className="w-4" />
        </Button>
      }
    >
      <Await resolve={rootData?.cart}>
        {(cart) => {
          const cartCount = cart?.lines?.edges.length
          console.log("cartCount", cartCount)
          return (
            <Link to="/cart">
              <Button
                size={"icon"}
                variant={"ghost"}
                className="relative rounded-full"
              >
                <ShoppingCartIcon className="w-4" />
                {cartCount === 0 ? (
                  ""
                ) : (
                  <div className="absolute top-0 right-0 h-4 w-4 rounded-full bg-gray-800 align-center text-white text-xs">
                    {cartCount}
                  </div>
                )}
              </Button>
            </Link>
          )
        }}
      </Await>
    </Suspense>
  )
}
