import typographicBase from "typographic-base/index"

export function formatText(input?: string | React.ReactNode) {
  if (!input) {
    return
  }

  if (typeof input !== "string") {
    return input
  }

  return typographicBase(input, { locale: "en-us" }).replace(
    /\s([^\s<]+)\s*$/g,
    "\u00A0$1",
  )
}
