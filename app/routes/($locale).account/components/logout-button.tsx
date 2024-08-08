import { Form } from "@remix-run/react"
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale"

type Props = {
  children: React.ReactNode
}

export function LogoutForm(props: Props) {
  const prefix = usePrefixPathWithLocale("/account/logout")

  return (
    <Form method="post" action={prefix}>
      {props.children}
    </Form>
  )
}
