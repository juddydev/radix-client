import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import ContactInput from "~/routes/($locale).contact/components/contact-input"

export default function ContactPage() {
  const text1 =
    "お客様からのご意見は今度のサービスの向上・改善に役立ててまいります。\n何かご質問がございましたらお気軽にお問い合わせください。"

  const text2 =
    "オンラインのご注文に関してサポートが必要な場合は、下記お問い合わせフォームよりお問い合わせください。\n土日・祝日にお問い合わせいただいた内容については、誠に恐れ入りますが翌営業日以降にご連絡させていただきます。"

  const businessHours = "営業時間 ： 11:00-20:00"

  const storeLink =
    "店舗についてのお問い合わせは店舗一覧ページからお電話にてお問い合わせください。"

  return (
    <main>
      <div className="container">
        <CustomBreadcrumb
          items={[{ title: "お問い合わせ", href: "/contact" }]}
        />
      </div>
      <header className="max-auto container max-w-screen-xl space-y-2 py-12">
        <h1 className={"text-4xl"}>{"CONTACT"}</h1>
        <p className="text-sm opacity-40">{"お問い合わせ"}</p>
      </header>
      <Separator />
      <div className="max-auto container w-full max-w-screen-md space-y-8 px-8 py-12 pb-16 md:space-y-8 md:px-16">
        <p className="whitespace-pre-wrap text-sm">{text1}</p>
        <div className="space-y-8 md:space-y-0">
          <p className="whitespace-pre-wrap text-sm">{text2}</p>
          <p className="whitespace-pre-wrap text-sm">{businessHours}</p>
        </div>
        <p className="flex whitespace-pre-wrap text-sm">
          店舗についてのお問い合わせは店舗一覧ページからお電話にてお問い合わせください。
        </p>
        <ContactInput />
        <div className="flex justify-center pt-8">
          <Button className="w-96 rounded-3xl">{"送信"}</Button>
        </div>
      </div>
    </main>
  )
}
