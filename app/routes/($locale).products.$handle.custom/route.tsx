import { useState } from "react"
import { useLocation } from "@remix-run/react"
import ModelViewer from "~/routes/($locale).products.$handle.custom/components/model"
import Action from "~/routes/($locale).products.$handle.custom/components/action"

export default function CustomPage() {
  const location = useLocation()
  const data = location.state?.data

  if (!data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        No data available
      </div>
    )
  }

  const textureNodes = data.media.nodes.filter(
    (m: { __typename: string; alt: string }) => {
      return (m.__typename === "MediaImage" && m.alt === "") || null
    },
  )
  const [upperMapTextureURL, setUpperMapTextureURL] = useState(
    textureNodes[31].image.url,
  )
  const [upperNormalTextureURL, setUpperNormalTextureURL] = useState(
    textureNodes[43].image.url,
  )
  const [upperRoughnessTextureURL, setUpperRoughnessTextureURL] = useState(
    textureNodes[29].image.url,
  )
  const [soleMapTextureURL, setSoleMapTextureURL] = useState(
    textureNodes[8].image.url,
  )
  const [checkedValue, setCheckedValue] = useState<boolean>(false)

  return (
    <div className="flex h-full w-full">
      {data.handle === "uni-703-01" ? (
        <div className="flex w-full flex-col justify-between lg:flex-row">
          <ModelViewer
            upperMapTextureURL={upperMapTextureURL}
            upperNormalTextureURL={upperNormalTextureURL}
            upperRoughnessTextureURL={upperRoughnessTextureURL}
            soleMapTextureURL={soleMapTextureURL}
            checkedValue={checkedValue}
          />
          <Action
            setUpperMapTextureURL={setUpperMapTextureURL}
            setUpperNormalTextureURL={setUpperNormalTextureURL}
            setUpperRoughnessTextureURL={setUpperRoughnessTextureURL}
            setSoleMapTextureURL={setSoleMapTextureURL}
            setCheckedValue={setCheckedValue}
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          No Models
        </div>
      )}
    </div>
  )
}
