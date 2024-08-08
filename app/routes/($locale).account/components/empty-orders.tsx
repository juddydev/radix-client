import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale"

export function EmptyOrders() {
  return (
    <div>
      <p className="mb-1">You haven&apos;t placed any orders yet.</p>
      <div className="w-48">
        <Link to={usePrefixPathWithLocale("/")}>
          <Button className="mt-2 w-full text-sm" variant="secondary">
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
