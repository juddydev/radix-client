import { Link, Outlet } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"
import {
  Money,
  type ShopifyAnalyticsProduct,
  VariantSelector,
  Image,
} from "@shopify/hydrogen"
import { useRef, useState } from "react"
import type { ProductVariantFragmentFragment } from "storefrontapi.generated"
import { AddToCartButton } from "~/components/add-to-cart-button"
import { Button } from "~/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { loader } from "~/routes/($locale).products.$handle._index/route"

type Props = {
  variants: ProductVariantFragmentFragment[]
  onChangeColor: (val: string) => void
}

type ImageMedia = {
  __typename: "Image"
  id: string
  alt?: string | null
  mediaContentType: string
  image: { url: string }
}

export function ProductForm(props: Props) {
  const data = useLoaderData<typeof loader>()

  const closeRef = useRef<HTMLButtonElement>(null)

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = data.product.selectedVariant

  /**
   * 在庫切れ
   */
  const isOutOfStock = !selectedVariant?.availableForSale

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount

  const [firstProduct] = data.analytics.products

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...firstProduct,
    quantity: 1,
  }
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>()

  const onSoldOut = (value: number) => {
    isVisible === false ? setIsVisible(true) : setIsVisible(false)
    setSelectedVariantIndex(value)
  }

  const variantImage = (value: string) => {
    if (!value) return null
    const imageObject = data.product.media.nodes.filter((m) => {
      const variantColor = m.alt?.split(".")[0].replace("_", "-").toLowerCase()
      if (variantColor !== value) return false
      const variantDirection = m.alt?.split(".")

      return (
        variantColor === value && variantDirection?.includes("DEFAULT") === true
      )
    })
    return imageObject[0]?.image
  }

  return (
    <div className="space-y-4">
      {selectedVariant && (
        <div>
          <span className="font-semibold text-lg">
            <Money
              withoutTrailingZeros
              data={selectedVariant.price}
              as="span"
              data-test="price"
            />
            {isOnSale && selectedVariant.compareAtPrice && (
              <Money
                withoutTrailingZeros
                data={selectedVariant.compareAtPrice}
                as="span"
                className="strike opacity-50"
              />
            )}
          </span>
          <span className="text-xs">{"（税込）"}</span>
        </div>
      )}

      <VariantSelector
        handle={data.product.handle}
        options={data.product.options}
        variants={props.variants}
      >
        {(context) => {
          const availableOptions = context.option.values.filter((value) => {
            return value
          })
          const isAvailable = 0 < availableOptions.length
          if (!isAvailable) return null
          if (context.option.name === "color") {
            return (
              <div className="space-y-1">
                <div className="flex gap-x-4 overflow-x-scroll sm:grid-cols-3 md:grid md:overflow-x-visible lg:grid-cols-3">
                  {availableOptions.map((option, index) => {
                    if (option?.variant?.image === null) return null
                    return (
                      <Link
                        className="flex-shrink-0"
                        to={`${option.to}`}
                        key={option.to}
                      >
                        {!option.isAvailable &&
                        isVisible &&
                        index === selectedVariantIndex ? (
                          <p
                            className={
                              "h-8 rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-sm"
                            }
                          >
                            在庫なし
                          </p>
                        ) : (
                          <p className="h-8" />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            props.onChangeColor(
                              option.value.replace("-", "_").toUpperCase(),
                            )
                          }}
                        >
                          <Image
                            loading={index === 0 ? "eager" : "lazy"}
                            data={variantImage(option.value)}
                            alt={option.value}
                            key={option.value}
                            className={`${option.isAvailable ? "" : "opacity-40"} aspect-square h-full w-full object-cover ${option.isActive ? "rounded border border-gray-400" : ""}`}
                            sizes="30vw"
                            onMouseOver={() => onSoldOut(index)}
                            onMouseOut={() => onSoldOut(index)}
                          />
                        </button>
                      </Link>
                    )
                  })}
                </div>
                {/* <ColorGuideDialog /> */}
                <legend>{"カラー"}</legend>
                <Select
                  onValueChange={(value) =>
                    props.onChangeColor(value.replace("-", "_").toUpperCase())
                  }
                >
                  <SelectTrigger className="w-full rounded">
                    <SelectValue placeholder={context.option.value} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableOptions.map((option, key) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={!option.isAvailable}
                        >
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )
          }
          if (context.option.name === "size") {
            return (
              <div className="space-y-1">
                <legend>{"サイズ"}</legend>
                <Select>
                  <SelectTrigger className="w-full rounded">
                    <SelectValue placeholder={context.option.value} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={!option.isAvailable}
                        >
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )
          }
        }}
      </VariantSelector>
      {/* Custom-Order */}
      <Link
        to={`/products/${data.product.handle}/custom`}
        className={"block"}
        prefetch="intent"
        state={{ data: data.product }}
      >
        <Button variant="outline" className="mt-4 w-full">
          {"カスタマイズ"}
        </Button>
      </Link>
      <Outlet />
      {selectedVariant && (
        <div className="grid items-stretch gap-4">
          {isOutOfStock ? (
            <Button variant="secondary" disabled>
              {"売り切れ"}
            </Button>
          ) : (
            <div className="space-y-1">
              <p className="text-center text-sm">{"本日から8日以内に発送"}</p>
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]}
                analytics={{
                  products: [productAnalytics],
                  totalValue: Number.parseFloat(productAnalytics.price),
                }}
              >
                {"カートに入れる"}
              </AddToCartButton>
            </div>
          )}
          {/* {!isOutOfStock && (
            <ShopPayButton
              width="100%"
              variantIds={[selectedVariant.id]}
              storeDomain={data.storeDomain}
            />
          )} */}
        </div>
      )}
    </div>
  )
}
