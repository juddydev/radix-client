import { countries } from "~/lib/countries"
import { I18nLocale } from "~/lib/locale"

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url)

  const firstPathPart = `/${url.pathname
    .substring(1)
    .split("/")[0]
    .toLowerCase()}`

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries.default,
        pathPrefix: "",
      }
}
