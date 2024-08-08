import { Await, Link } from "@remix-run/react"
import { GripIcon } from "lucide-react"
import { Suspense } from "react"
import { appConfig } from "~/app-config"
import { CustomDialogContent } from "~/components/custom/custom-dialog-content"
import { LanguageButton } from "~/components/language-button"
import { Button } from "~/components/ui/button"
import { Dialog, DialogTrigger } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Separator } from "~/components/ui/separator"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

export function NavigationDialogButton() {
  const rootData = useRootLoaderData()

  const isLoggedIn = rootData?.isLoggedIn

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="rounded-full sm:hidden"
          size={"icon"}
        >
          <GripIcon className="w-4" />
        </Button>
      </DialogTrigger>
      <CustomDialogContent className="pt-16">
        <div className="grid gap-4 pb-4">
          <Input placeholder="キーワードで探す" className="rounded-full" />
          <Suspense
            fallback={<Button className="rounded-full">{"読み込み中"}</Button>}
          >
            <Await resolve={isLoggedIn} errorElement={null}>
              {(isLoggedIn) => (
                <Link to="/account" className="block w-full">
                  <Button className="w-full rounded-full">
                    {isLoggedIn ? "マイページ" : "ログイン"}
                  </Button>
                </Link>
              )}
            </Await>
          </Suspense>
        </div>
        <div>
          <Separator />
          <Link to={"/products"} className="block py-3">
            {"商品一覧"}
          </Link>
          <Separator />
          <Link to={"/products"} className="block py-3">
            {"革靴"}
          </Link>
          <Separator />
          <Link to={"/products"} className="block py-3">
            {"ブーツ"}
          </Link>
          <Separator />
          <Link to={"/products"} className="block py-3">
            {"スニーカー"}
          </Link>
          <Separator />
          <Link to={"/products"} className="block py-3">
            {"ゴルフシューズ"}
          </Link>
          <Separator />
          <Link to={"/products"} className="block py-3">
            {"ゴルフウェア"}
          </Link>
          <Separator />
          <Link to={"/products"} className="block py-3">
            {"アクセサリー・小物"}
          </Link>
          <Separator />
        </div>
        {appConfig.features.languageSwitcher && (
          <div className="flex">
            <LanguageButton />
          </div>
        )}
      </CustomDialogContent>
    </Dialog>
  )
}
