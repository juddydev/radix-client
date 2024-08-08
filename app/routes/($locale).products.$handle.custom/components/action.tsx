import { useState } from "react"
import { useLocation, Link } from "@remix-run/react"
import { XIcon, Check } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { AddToCartButton } from "~/components/add-to-cart-button"

interface ActionProps {
  setUpperMapTextureURL: (url: string | undefined) => void
  setUpperNormalTextureURL: (url: string | undefined) => void
  setUpperRoughnessTextureURL: (url: string | undefined) => void
  setSoleMapTextureURL: (url: string | undefined) => void
  setCheckedValue: (value: boolean) => void
}

export default function Action({
  setUpperMapTextureURL,
  setUpperNormalTextureURL,
  setUpperRoughnessTextureURL,
  setSoleMapTextureURL,
  setCheckedValue,
}: ActionProps) {
  const location = useLocation()
  const data = location.state?.data
  const selectedVariant = data.selectedVariant
  const sizeValues = data.options.find((m: { name: string }) => {
    return m.name === "size"
  })
  const textureNodes = data.media.nodes.filter(
    (m: { __typename: string; alt: string }) => {
      return (m.__typename === "MediaImage" && m.alt === "") || null
    },
  )

  const upperColors = [
    { name: "black", color: "#201E1E", texture: textureNodes[31].image.url },
    { name: "gray", color: "#33353F", texture: textureNodes[41].image.url },
    {
      name: "light-brown",
      color: "#9E5723",
      texture: textureNodes[42].image.url,
    },
    { name: "wine-red", color: "#7F3623", texture: textureNodes[35].image.url },
    { name: "blue", color: "#4A5878", texture: textureNodes[28].image.url },
    {
      name: "dark-brown",
      color: "#57392B",
      texture: textureNodes[32].image.url,
    },
  ]
  const triggers: { value: string; content: string }[] = [
    { value: "materials", content: "素材" },
    { value: "colors", content: "カラー" },
    { value: "method", content: "製法" },
    { value: "sole", content: "ソール" },
    { value: "letter", content: "アクセサリー" },
    // { value: "insole", content: "インソール" },
    // { value: "inner", content: "インナー" },
    { value: "size", content: "サイズ" },
  ]
  const materialGroups: {
    name: string
    value: string
    normal: string
    roughness: string
  }[] = [
    {
      name: "baron-leather",
      value: "バロンレザー",
      normal: textureNodes[43].image.url,
      roughness: textureNodes[29].image.url,
    },
    {
      name: "emboss-01",
      value: "エンボス１",
      normal: textureNodes[37].image.url,
      roughness: textureNodes[20].image.url,
    },
    {
      name: "emboss-02",
      value: "エンボス2",
      normal: textureNodes[46].image.url,
      roughness: textureNodes[33].image.url,
    },
    {
      name: "emboss-03",
      value: "エンボス3",
      normal: textureNodes[38].image.url,
      roughness: textureNodes[26].image.url,
    },
    {
      name: "emboss-04",
      value: "エンボス4",
      normal: textureNodes[39].image.url,
      roughness: textureNodes[27].image.url,
    },
    {
      name: "emboss-05",
      value: "エンボス5",
      normal: textureNodes[40].image.url,
      roughness: textureNodes[21].image.url,
    },
    {
      name: "crocodile-back",
      value: "クロコダイル背",
      normal: textureNodes[44].image.url,
      roughness: textureNodes[45].image.url,
    },
    {
      name: "crocodile-belly",
      value: "クロコダイル腹",
      normal: textureNodes[36].image.url,
      roughness: textureNodes[30].image.url,
    },
    {
      name: "kipskin",
      value: "キップスキン",
      normal: textureNodes[47].image.url,
      roughness: textureNodes[34].image.url,
    },
  ]

  const accessoryGroups: { name: string; value: string; color: string }[] = [
    {
      name: "black",
      value: "プレート黒",
      color: textureNodes[8].image.url,
    },
    {
      name: "blue",
      value: "プレート青",
      color: textureNodes[12].image.url,
    },
    {
      name: "dark-brown",
      value: "プレートダークブラウン",
      color: textureNodes[9].image.url,
    },
    {
      name: "wine-red",
      value: "プレートワインレッド",
      color: textureNodes[14].image.url,
    },
    {
      name: "gray",
      value: "プレートグレー",
      color: textureNodes[10].image.url,
    },
    {
      name: "light-brown",
      value: "プレートライトブラウン",
      color: textureNodes[11].image.url,
    },
  ]

  const soleGroups: { name: string; value: string }[] = [
    { name: "half-rubber", value: "ハーフラバー" },
    { name: "leather-01", value: "レザー 1" },
    { name: "leather-02", value: "レザー 2" },
    { name: "leather-03", value: "レザー 3" },
  ]

  const [selectedColor, setSelectedColor] = useState(upperColors[0].name)
  const [selectedMaterial, setSelectedMaterial] = useState(
    materialGroups[0].name,
  )
  const [selectedSole, setSelectedSole] = useState(soleGroups[0].name)
  const [selectedAccessory, setSelectedAccessory] = useState(
    accessoryGroups[0].name,
  )
  const [selectedSize, setSelectedSize] = useState(sizeValues.values[0])

  const handleAccessorySelect = (accessoryId: string) => {
    setSelectedAccessory(accessoryId)
  }
  const selectedAccessoryGroup = accessoryGroups.find((group) => {
    return group.name === selectedAccessory
  })
  if (
    selectedAccessory === "" ||
    selectedAccessory === undefined ||
    selectedAccessory === null
  ) {
    setSoleMapTextureURL(textureNodes[8]?.image.url)
  } else {
    setSoleMapTextureURL(selectedAccessoryGroup?.color)
  }

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterial(materialId)
  }
  const selectedUpperGroup = materialGroups.find((group) => {
    return group.name === selectedMaterial
  })
  if (
    selectedMaterial === "" ||
    selectedMaterial === undefined ||
    selectedMaterial === null
  ) {
    const upperNormalTextureURL = textureNodes[43]?.image.url ?? ""
    const upperRoughnessTextureURL = textureNodes[29]?.image.url ?? ""
    setUpperNormalTextureURL(upperNormalTextureURL)
    setUpperRoughnessTextureURL(upperRoughnessTextureURL)
  } else {
    const upperNormalTextureURL = selectedUpperGroup?.normal ?? ""
    const upperRoughnessTextureURL = selectedUpperGroup?.roughness ?? ""
    setUpperNormalTextureURL(upperNormalTextureURL)
    setUpperRoughnessTextureURL(upperRoughnessTextureURL)
  }

  const handleSelectedColor = (color: string) => {
    setSelectedColor(color)
  }

  const handleCheckedChange = (checked: boolean) => {
    setCheckedValue(checked)
  }

  const handleSoleSelect = (soleId: string) => {
    setSelectedSole(soleId)
  }

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId)
  }

  return (
    <div className="flex h-full w-full flex-row-reverse lg:w-[700px] ">
      {/* <div className='absolute right-4 top-4 z-10'> */}
      <div className="flex w-full">
        {/* <div className="absolute right-0 max-lg:w-full"> */}
        <div>
          <div className="absolute top-24 right-8">
            <Link to={`/products/${data.handle}`}>
              <Button
                variant={"secondary"}
                size="icon"
                className="h-8 w-8 rounded-full bg-neutral-500 text-white hover:text-black"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-col rounded-tl-3xl rounded-tr-3xl border border-slate-50 shadow-[0_-10px_8px_0_rgba(240,240,240,0.6)] lg:gap-6 lg:rounded-tr-none lg:rounded-bl-3xl lg:shadow-[-4px_0_16px_0_rgba(240,240,240,0.6)]">
            <Tabs
              defaultValue="materials"
              className="justify-start gap-4 px-6 pt-16 pb-4 lg:flex"
            >
              <TabsList className="max-w-full gap-4 overflow-x-auto lg:grid lg:overflow-visible">
                {triggers.map((trigger) => (
                  <TabsTrigger
                    key={trigger.value}
                    value={trigger.value}
                    className="px-8"
                  >
                    {trigger.content}
                  </TabsTrigger>
                ))}
              </TabsList>
              {/* Materials */}
              <TabsContent value="materials">
                <RadioGroup
                  className="p-8 lg:border"
                  defaultValue={selectedMaterial}
                  onValueChange={handleMaterialSelect}
                >
                  {materialGroups.map((materialGroup) => (
                    <div
                      key={materialGroup.name}
                      className="flex cursor-pointer items-center"
                    >
                      <RadioGroupItem
                        value={materialGroup.name}
                        className="mr-4"
                        id={materialGroup.name}
                      />
                      <label htmlFor={materialGroup.name}>
                        {materialGroup.value}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
              {/* Colors */}
              <TabsContent value="colors">
                <div className="scrollbar-hide overflow-x-auto lg:overflow-visible">
                  <div className="flex grid-cols-4 gap-x-4 gap-y-8 lg:grid lg:border lg:border-slate-200 lg:p-6">
                    {upperColors.map((upperColor) => (
                      <Button
                        key={upperColor.name}
                        style={{ backgroundColor: upperColor.color }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded hover:opacity-80"
                        onClick={() => {
                          handleSelectedColor(upperColor.name)
                          setUpperMapTextureURL(upperColor.texture)
                        }}
                      >
                        {selectedColor === upperColor.name && (
                          <Check className="text-white" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
              {/* Manufacturing Method */}
              <TabsContent value="method">
                <div className="flex items-center p-8 lg:border">
                  <label>表示</label>
                  <Switch
                    className="m-4"
                    onCheckedChange={handleCheckedChange}
                  />
                  <label>非表示</label>
                </div>
              </TabsContent>
              {/* Sole */}
              <TabsContent value="sole">
                <RadioGroup
                  className="p-8 lg:border"
                  defaultValue={selectedSole}
                  onValueChange={handleSoleSelect}
                >
                  {soleGroups.map((soleGroup) => (
                    <div
                      key={soleGroup.name}
                      className="flex cursor-pointer items-center"
                    >
                      <RadioGroupItem
                        value={soleGroup.name}
                        className="mr-4"
                        id={soleGroup.name}
                      />
                      <label htmlFor={soleGroup.name}>{soleGroup.value}</label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
              {/* Accessories */}
              <TabsContent value="letter">
                <RadioGroup
                  className="p-8 lg:border"
                  defaultValue={selectedAccessory}
                  onValueChange={handleAccessorySelect}
                >
                  {accessoryGroups.map((accessoryGroup) => (
                    <div
                      key={accessoryGroup.name}
                      className="flex cursor-pointer items-center"
                    >
                      <RadioGroupItem
                        value={accessoryGroup.name}
                        className="mr-4"
                        id={accessoryGroup.name}
                      />
                      <label htmlFor={accessoryGroup.name}>
                        {accessoryGroup.value}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
              {/* <TabsContent value="insole">インソール</TabsContent>
              <TabsContent value="inner">インナー</TabsContent> */}
              {/* Size */}
              <TabsContent value="size">
                <RadioGroup
                  className="p-8 lg:border"
                  defaultValue={selectedSize}
                  onValueChange={handleSizeSelect}
                >
                  {sizeValues.values.map((size: string) => (
                    <div
                      key={size}
                      className="flex cursor-pointer items-center"
                    >
                      <RadioGroupItem value={size} className="mr-4" id={size} />
                      <label htmlFor={size}>{size}</label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
            </Tabs>
            <div className="items-end justify-end gap-4 whitespace-nowrap p-6 lg:flex">
              <div>
                <span className="pl-2 font-semibold text-xl">{`¥${data.variants?.nodes[0]?.price.amount}`}</span>
                <span className="text-sm">(税込)</span>
              </div>
              {/* <Button className="w-full rounded-none p-6 lg:w-[300px]">
                カートに入れる
              </Button> */}
              <AddToCartButton
                lines={[
                  {
                    quantity: 1,
                    merchandiseId: selectedVariant.id,
                    attributes: [
                      { key: "material", value: selectedMaterial },
                      { key: "accessory", value: selectedAccessory },
                      { key: "sole", value: selectedSole },
                      { key: "color", value: selectedColor },
                      { key: "size", value: selectedSize },
                    ],
                  },
                ]}
              >
                <div className="w-full rounded-none p-6 lg:w-[300px]">
                  {"カートに入れる"}
                </div>
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
