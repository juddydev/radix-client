import { Separator } from "~/components/ui/separator"

type Props = {
  lastName: string | null
  firstName: string | null
}

export function AccountProfile(props: Props) {
  const isNull = props.firstName === null || props.lastName === null

  const nameText = `${props.lastName} ${props.firstName}`

  return (
    // biome-ignore lint/nursery/useSortedClasses: <explanation>
    <div className="space-y-8 w-full">
      {!isNull && (
        <div className="flex items-center gap-2">
          <span className="text-xl">{nameText}</span>
          <span>{"さま"}</span>
        </div>
      )}
      {isNull && (
        <div className="text-xl">{"お名前が登録されていません。"}</div>
      )}
      <Separator />
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:gap-x-16 lg:gap-y-8 lg:pr-8">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>{"ご利用可能ポイント"}</span>
            <span className="space-x-1">
              <span className="text-lg">{"0"}</span>
              <span className="text-sm">{"pt"}</span>
            </span>
          </div>
          <div className="text-right text-xs">
            {"(うち期間限定ポイント: 0pt)"}
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <span>{"所有クーポン"}</span>
            <span className="space-x-1">
              <span className="text-lg">{"0"}</span>
              <span className="text-sm">{"件"}</span>
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>{"有効待ちポイント"}</span>
          <span className="space-x-1">
            <span className="text-lg">{"0"}</span>
            <span className="text-sm">{"pt"}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
