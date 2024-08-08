import { type ErrorResponse, Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"

type Props = {
  error: ErrorResponse
}

export function RouteError(props: Props) {
  const description =
    "お探しのページのURLは変更されたか削除された可能性があります。"

  return (
    <div className="container py-40">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="font-bold text-2xl">{"ページが見つかりません。"}</h2>
          <p>{description}</p>
        </div>
        <Link to={"/"} className="block">
          <Button>{"ホームに戻る"}</Button>
        </Link>
      </div>
    </div>
  )
}
