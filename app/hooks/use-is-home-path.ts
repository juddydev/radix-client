import { useLocation } from "@remix-run/react"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { DEFAULT_LOCALE } from "~/lib/default-locale"

export function useIsHomePath() {
  const { pathname } = useLocation()

  const rootData = useRootLoaderData()

  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE

  const strippedPathname = pathname.replace(selectedLocale.pathPrefix, "")

  return strippedPathname === "/"
}
