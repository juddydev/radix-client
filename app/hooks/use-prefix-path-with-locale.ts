import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { DEFAULT_LOCALE } from "~/lib/default-locale"

export function usePrefixPathWithLocale(path: string) {
  const rootData = useRootLoaderData()

  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE

  return `${selectedLocale.pathPrefix}${
    path.startsWith("/") ? path : `/${path}`
  }`
}
