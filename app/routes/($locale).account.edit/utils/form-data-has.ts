export const formDataHas = (formData: FormData, key: string) => {
  if (!formData.has(key)) return false

  const value = formData.get(key)
  return typeof value === "string" && value.length > 0
}
