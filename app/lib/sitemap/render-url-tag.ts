type Props = {
  url: string
  lastMod?: string
  changeFreq?: string
  image?: {
    url: string
    title?: string
    caption?: string
  }
}

export function renderUrlTag(props: Props) {
  return `
    <url>
      <loc>${props.url}</loc>
      <lastmod>${props.lastMod}</lastmod>
      <changefreq>${props.changeFreq}</changefreq>
      ${
        props.image
          ? `
        <image:image>
          <image:loc>${props.image.url}</image:loc>
          <image:title>${props.image.title ?? ""}</image:title>
          <image:caption>${props.image.caption ?? ""}</image:caption>
        </image:image>`
          : ""
      }

    </url>
  `
}
