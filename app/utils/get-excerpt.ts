export function getExcerpt(text: string) {
  const regex = /<p.*>(.*?)<\/p>/

  const match = regex.exec(text)

  return match?.length ? match[0] : text
}
