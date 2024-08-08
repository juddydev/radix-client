import { RootFooter } from "~/components/root-footer"
import { RootHeader } from "~/components/root-header"

type Props = {
  children: React.ReactNode
}

/**
 * 不要
 */
export function RootLayout(props: Props) {
  return (
    <>
      <RootHeader />
      {props.children}
      <RootFooter />
    </>
  )
}
