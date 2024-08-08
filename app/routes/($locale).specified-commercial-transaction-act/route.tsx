import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import { Separator } from "~/components/ui/separator"

export default function SctaPage() {
  const text = `運営会社名: FUJIUNI株式会社
代表者名: 齋藤秀美
所在地: 105-0012　東京都港区芝大門1-10-18　PMO芝大門8F
電話番号: 03-6809-1882
メールアドレス: uninoverse@fujiuni.co.jp
受付時間: 10:00〜19:00（土日祝日を除く）
ウェブサイトのURL: https://uninoverse.com/`

  const sections = text.split("\n").map((section) => {
    const [title, content] = section.split(": ").map((t) => t.trim())
    return { title, content }
  })

  return (
    <main>
      <div className="container">
        <CustomBreadcrumb
          items={[
            {
              title: "特定商取引法に基づく表示",
              href: "/specified-commercial-transaction-act",
            },
          ]}
        />
      </div>
      <header className="max-auto container max-w-screen-xl space-y-2 py-12">
        <h1 className={"text-4xl"}>{"STORE"}</h1>
        <p className="text-sm opacity-40">{"特定商取引法に基づく表示"}</p>
      </header>
      <Separator />
      <div className={"container my-8 max-w-2xl space-y-2"}>
        {sections.map((section) => (
          <div key={section.title} className="flex gap-x-2">
            <h3 className="font-bold">{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
