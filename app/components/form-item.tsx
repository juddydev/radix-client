import { ValidationError } from "@tanstack/react-form"
import { CircleAlertIcon } from "lucide-react"
import { FormOptionalBadge } from "~/components/form-optional-badge"
import { FormRequiredBadge } from "~/components/form-required-badge"
import { Label } from "~/components/ui/label"

type InputProps = {
  isRequired?: boolean
  labelName: string
  ariaLabel: string
  errors: ValidationError[]
  children: React.ReactNode
}

/**
 * フォームの入力
 */
export function FormItem(props: InputProps) {
  const errors = props.errors
    .flatMap((error) => {
      return error?.toString().split(",")
    })
    .filter((t) => t !== undefined)

  return (
    <>
      <div className="flex">
        <Label aria-label={props.ariaLabel} className="text-sm">
          {props.labelName}
          {props.isRequired ? <FormRequiredBadge /> : <FormOptionalBadge />}
        </Label>
      </div>
      {props.children}
      {errors.map((error) => (
        <div className="flex items-center gap-x-1" key={error?.toString()}>
          <CircleAlertIcon
            className="self-center fill-red-500 stroke-white"
            style={{ transform: "scale(-1, 1)" }}
          />
          <p className="text-red-600 text-sm not-italic">{error}</p>
        </div>
      ))}
    </>
  )
}
