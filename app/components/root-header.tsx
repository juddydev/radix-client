import { Link, useNavigate } from "@remix-run/react"
import { SearchIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { appConfig } from "~/app-config"
import { AccountLink } from "~/components/account-link"
import { CartCount } from "~/components/cart-count"
import { HeaderNavLink } from "~/components/header-nav-link"
import { LanguageButton } from "~/components/language-button"
import { NavigationDialogButton } from "~/components/navigation-dialog-button"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/cn"
import { useDebounce } from "@react-hook/debounce"

export function RootHeader() {
  const navigate = useNavigate()

  const [isSearchOpen, openSearch] = useState(false)

  const [searchInput, setSearchInput] = useState("")

  const [searchText, setSearchText] = useDebounce(searchInput, 1000)

  const onOpenSearch = () => {
    openSearch((v) => !v)
  }

  const onCloseSearch = () => {
    openSearch(false)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSearchText(searchInput)
  }, [searchInput])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (typeof searchText !== "string") return
    if (searchText.trim() === "") return
    navigate(`/search?q=${searchText}`, { replace: true })
  }, [searchText])

  return (
    <>
      <header
        className={cn("fixed top-0 w-full space-x-8 py-4")}
        style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
      >
        <div className="container flex items-center justify-between">
          {!isSearchOpen && (
            <div className="flex items-center space-x-8">
              <Link to="/" className={"text-2xl"} prefetch="intent">
                {appConfig.site.name}
              </Link>
              <div className="flex items-center gap-x-8">
                <nav className="flex gap-x-6">
                  <HeaderNavLink to={"/products"}>{"商品一覧"}</HeaderNavLink>
                  <div className="hidden items-center gap-x-6 lg:flex">
                    <HeaderNavLink to={"/products?category=leather-shoes"}>
                      {"革靴"}
                    </HeaderNavLink>
                    <HeaderNavLink to={"/products?category=boots"}>
                      {"ブーツ"}
                    </HeaderNavLink>
                    <HeaderNavLink to={"/products?category=sneakers"}>
                      {"スニーカー"}
                    </HeaderNavLink>
                    <HeaderNavLink to={"/products?category=golf-shoes"}>
                      {"ゴルフシューズ"}
                    </HeaderNavLink>
                    <HeaderNavLink to={"/products?category=golf-wear"}>
                      {"ゴルフウェア"}
                    </HeaderNavLink>
                    {/* <HeaderNavLink to={"/products"}>
                    {"アクセサリー・小物"}
                  </HeaderNavLink> */}
                  </div>
                </nav>
              </div>
            </div>
          )}
          <div
            className={cn("flex items-center gap-2", {
              "w-full": isSearchOpen,
            })}
          >
            {appConfig.features.languageSwitcher && (
              <div className="hidden sm:block">
                <LanguageButton />
              </div>
            )}
            <Input
              className={cn("w-full sm:block", {
                hidden: !isSearchOpen,
              })}
              placeholder="検索"
              onChange={(event) => {
                setSearchInput(event.target.value)
              }}
            />
            {isSearchOpen && (
              <Button
                size={"icon"}
                variant={"ghost"}
                className="rounded-full"
                onClick={onCloseSearch}
              >
                <XIcon className="w-4" />
              </Button>
            )}
            {!isSearchOpen && (
              <div className="flex min-w-fit space-x-1">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="rounded-full md:hidden"
                  onClick={onOpenSearch}
                >
                  <SearchIcon className="w-4" />
                </Button>
                <CartCount />
                <AccountLink />
                <NavigationDialogButton />
              </div>
            )}
          </div>
        </div>
      </header>
      <div style={{ height: "72px" }} />
    </>
  )
}
