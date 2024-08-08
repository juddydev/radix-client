import { Await, Link } from "@remix-run/react"
import { LogInIcon, UserIcon } from "lucide-react"
import { Suspense } from "react"
import { Button } from "~/components/ui/button"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

export function AccountLink() {
  const rootData = useRootLoaderData()

  const isLoggedIn = rootData?.isLoggedIn

  // if (appConfig.features.login === false) return null

  return (
    <Link to="/account" className="hidden md:block">
      <Button size={"icon"} variant={"ghost"} className="rounded-full">
        <Suspense fallback={<LogInIcon />}>
          <Await resolve={isLoggedIn} errorElement={<LogInIcon />}>
            {(isLoggedIn) =>
              isLoggedIn ? (
                <UserIcon className="w-4" />
              ) : (
                <UserIcon className="w-4" />
              )
            }
          </Await>
        </Suspense>
      </Button>
    </Link>
  )
}
