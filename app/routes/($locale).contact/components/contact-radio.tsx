import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"

export default function ContactRadio() {
  return (
    <div className="space-y-2">
      <p className="text-sm">{"お問い合わせ項目"}</p>
      <RadioGroup defaultValue="r1">
        <div className="flex flex-col gap-y-2 md:flex-row md:space-x-16">
          <div className="flex flex-col space-y-2 md:ml-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="r1" id="r1" />
              <Label htmlFor="r1">{"ご注文について"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="r2" id="r2" />
              <Label htmlFor="r2">{"配送について"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="r3" id="r3" />
              <Label htmlFor="r3">{"スキャナーについて"}</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="r4" id="r4" />
              <Label htmlFor="r4">{"商品について"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="r5" id="r5" />
              <Label htmlFor="r5">{"会員情報について"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="r6" id="r6" />
              <Label htmlFor="r6">{"その他"}</Label>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
