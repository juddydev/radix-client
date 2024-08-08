import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import ContactRadio from "~/routes/($locale).contact/components/contact-radio"

export default function ContactInput() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-2">
        <p className="text-sm">{"氏名（漢字）"}</p>
        <Input placeholder="山田太郎" />
      </div>
      <div className="space-y-2">
        <p className="text-sm">{"氏名（カナ）"}</p>
        <Input placeholder="ヤマダタロウ" />
      </div>
      <div className="space-y-2">
        <p className="text-sm">{"メールアドレス"}</p>
        <Input placeholder="mail@example.com" />
      </div>
      <ContactRadio />
      <div className="space-y-2">
        <p className="text-sm">{"お問い合わせ内容"}</p>
        <Textarea
          className="h-40"
          placeholder="お問い合わせ内容を記入してください。"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-sm">
          <a href="/policies/privacyPolicy" className="underline">
            プライバシーポリシー
          </a>
          に同意します。
        </label>
      </div>
    </div>
  )
}
