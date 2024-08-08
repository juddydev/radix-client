import { useEffect, useState } from "react"

/**
 * Hydrationを完了したかどうかを返す
 */
export function useIsHydrated() {
  const [isHydrated, setHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return isHydrated
}
