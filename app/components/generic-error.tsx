import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { addLinksToStackTrace } from "~/lib/add-links-to-stack-trace"

type Props = {
  error?: { message: string; stack?: string }
}

export function GenericError(props: Props) {
  const description = "しばらくしてから再度お試しください。"

  return (
    <div className="container py-40">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="font-bold text-2xl">
            {"不明なエラーが発生しました。"}
          </h2>
          <p>{description}</p>
        </div>

        <Link to={"/"} className="block">
          <Button>{"ホームに戻る"}</Button>
        </Link>
        {props.error?.stack && (
          <pre
            style={{
              padding: "2rem",
              background: "hsla(10, 50%, 50%, 0.1)",
              color: "red",
              overflow: "auto",
              maxWidth: "100%",
            }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: addLinksToStackTrace(props.error.stack),
            }}
          />
        )}
      </div>
    </div>
  )
}
