import { Input, InputProps } from "~/components/ui/input"
import { cn } from "~/lib/cn"

type Props = InputProps & {
  isError: boolean
}

export function FormInput(props: Props) {
  return (
    <Input
      {...props}
      className={cn("border-none bg-gray-100 p-6", {
        "focus:invalid:border-red-500": props.isError,
        "focus:invalid:ring-red-500": props.isError,
      })}
    />
  )
}
