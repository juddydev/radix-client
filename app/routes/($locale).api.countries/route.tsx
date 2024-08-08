import { CacheLong, generateCacheControlHeader } from "@shopify/hydrogen"
import { json } from "@shopify/remix-oxygen"
import { countries } from "~/lib/countries"

export async function loader() {
  return json(
    { ...countries },
    {
      headers: { "cache-control": generateCacheControlHeader(CacheLong()) },
    },
  )
}

export default function Route() {
  return null
}
