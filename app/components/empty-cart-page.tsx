import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"

export function EmptyCartPage() {
  return (
    <section className="max-auto container max-w-screen-lg space-y-8 py-12">
      <p>{"まだ商品がカートに入っていません。"}</p>
      <Link className="block" to="/products">
        <Button>{"買い物を続ける"}</Button>
      </Link>
    </section>
  )
}
