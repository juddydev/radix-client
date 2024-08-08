import { Separator } from "~/components/ui/separator"

type Props = {
  children: React.ReactNode
}

export function NoResults(props: Props) {
  return (
    <section className="space-y-4">
      <p>{"何も見つかりませんでした。"}</p>
      <Separator />
      <div className="space-y-2">
        <h3>{"その他の商品"}</h3>
        {props.children}
      </div>
    </section>
  )
}
