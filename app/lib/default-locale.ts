import { countries } from "~/lib/countries"
import { I18nLocale } from "~/lib/locale"

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...countries.default,
  pathPrefix: "",
})
