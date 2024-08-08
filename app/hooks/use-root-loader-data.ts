import { useMatches } from "@remix-run/react"
import { SerializeFrom } from "@shopify/remix-oxygen"
import { loader } from "~/root"

export const useRootLoaderData = () => {
  const [root] = useMatches()

  return root?.data as SerializeFrom<typeof loader>
}
