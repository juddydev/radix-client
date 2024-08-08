import { I18nLocale } from "~/lib/locale"

export function parseAsCurrency(value: number, locale: I18nLocale) {
  const intl = new Intl.NumberFormat(`${locale.language}-${locale.country}`, {
    style: "currency",
    currency: locale.currency,
  })

  return intl.format(value)
}
