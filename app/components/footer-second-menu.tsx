import { Link } from "@remix-run/react"

export function FooterSecondMenu() {
  return (
    <div className="flex flex-col space-y-4">
      {/* <Link to={"/"} className="text-white text-xs opacity-80">
        {"お問い合わせ"}
      </Link> */}
      <Link to={"/terms"} className="text-white text-xs opacity-80">
        {"利用規約"}
      </Link>
      <Link to={"/policies/privacy"} className="text-white text-xs opacity-80">
        {"プライバシー・ポリシー"}
      </Link>
      <Link
        to={"/specified-commercial-transaction-act"}
        className="text-white text-xs opacity-80"
      >
        {"特定商取引法に基づく表示"}
      </Link>
    </div>
  )
}
