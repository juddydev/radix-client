type Props = {
  count: number
}

export function Badge(props: Props) {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center focus:ring-primary/5">
      <span>{props.count || 0}</span>
    </div>
  )
}
