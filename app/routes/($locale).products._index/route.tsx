import { json, useLoaderData, useSearchParams } from "@remix-run/react"
import {
  getPaginationVariables,
  getSeoMeta,
  SeoConfig,
} from "@shopify/hydrogen"
import { LoaderFunctionArgs, MetaArgs } from "@shopify/remix-oxygen"
import invariant from "tiny-invariant"
import { appConfig } from "~/app-config"
import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import { Button } from "~/components/ui/button"
import { getImageLoadingPriority } from "~/lib/get-image-loading-priority"
import { FilterButton } from "~/routes/($locale).products._index/components/filter-button"
import { ProductBrandFilter } from "~/routes/($locale).products._index/components/product-brand-filter"
import { ProductCard } from "~/routes/($locale).products._index/components/product-card"
import { ProductCategoryFilter } from "~/routes/($locale).products._index/components/product-category-filter"
import { ProductColorFilter } from "~/routes/($locale).products._index/components/product-color-filter"
import { ProductFilterAside } from "~/routes/($locale).products._index/components/product-filter-aside"
import { ProductFilterDialogButton } from "~/routes/($locale).products._index/components/product-filter-dialog-button"
import { ProductMaterialFilter } from "~/routes/($locale).products._index/components/product-material-filter"
import { ProductMethodFilter } from "~/routes/($locale).products._index/components/product-method-filter"
import { ProductPriceFilter } from "~/routes/($locale).products._index/components/product-price-filter"
import { ProductSceneFilter } from "~/routes/($locale).products._index/components/product-scene-filter"
import { ProductSortSelect } from "~/routes/($locale).products._index/components/product-sort-select"
import { useProductListFilter } from "~/routes/($locale).products._index/hooks/use-product-list-filter"
import { useProductListPageName } from "~/routes/($locale).products._index/hooks/use-product-list-page-name"
import { findCategoryBySlug } from "~/routes/($locale).products._index/utils/find-category-by-slug"
import { findSubCategoryBySlug } from "~/routes/($locale).products._index/utils/find-sub-category-by-slug"
import { PRODUCT_CARD_FRAGMENT } from "~/graphql/fragments"

export function meta({ data }: MetaArgs<typeof loader>) {
  return getSeoMeta(data?.seoConfig)
}

export default function AllProductsPage() {
  const data = useLoaderData<typeof loader>()

  const [searchParams, setSearchParams] = useSearchParams()

  const filter = useProductListFilter(searchParams, setSearchParams)

  const pageName = useProductListPageName(filter.category)

  const categoryProducts = data.products.nodes.filter((product) => {
    if (filter.category === null) return true
    const category = findCategoryBySlug(filter.category)
    for (const subCategory of category?.children ?? []) {
      if (subCategory.name === product.productType) {
        return true
      }
    }
    const currentSubCategory = findSubCategoryBySlug(filter.category)
    if (product.productType === currentSubCategory?.name) {
      return true
    }
    return false
  })

  const products = categoryProducts.filter((product) => {
    try {
      if (filter.brands.length !== 0) {
        const brands = appConfig.product.brands.filter((item) => {
          return filter.brands.includes(item.slug)
        })
        const target = brands.find((brand) => {
          return brand.name === product.vendor
        })
        if (typeof target === "undefined") return false
      }
      if (filter.scenes.length !== 0) {
        // シーンが存在しない
        if (!product.scene) return false
        const scenes = appConfig.product.cases.filter((item) => {
          return filter.scenes.includes(item.slug)
        })
        const values = JSON.parse(product.scene.value) as string[]
        const target = scenes.find((scene) => {
          return values.includes(scene.name)
        })
        if (typeof target === "undefined") return false
      }
      if (filter.methods.length !== 0) {
        // 製法が存在しない
        if (!product.process) return false
        const filterMethods = appConfig.product.methods.filter((item) => {
          return filter.methods.includes(item.slug)
        })
        const values = JSON.parse(product.process.value) as string[]
        const target = filterMethods.find((method) => {
          return values.includes(method.name)
        })
        if (typeof target === "undefined") return false
      }
      if (filter.materials.length !== 0) {
        // 素材が存在しない
        if (!product.materials) return false
        const filterMaterials = appConfig.product.materiels.filter((item) => {
          return filter.materials.includes(item.slug)
        })
        const values = JSON.parse(product.materials.value) as string[]
        const target = filterMaterials.find((item) => {
          return values.includes(item.name)
        })
        if (target === undefined) return false
      }
      if (filter.colors.length !== 0) {
        const option = product.options.find((option) => {
          return option.name === "color"
        })
        if (!option) return false
        const filterColors = appConfig.product.colors.filter((item) => {
          return filter.colors.includes(item.slug)
        })
        const target = filterColors.find((color) => {
          return option.values.includes(color.slug)
        })
        if (typeof target === "undefined") return false
      }
      if (filter.priceRange.min !== 0 || filter.priceRange.max !== 0) {
        const variant = product.variants.nodes[0]
        if (!variant) return false
        const amount = Number.parseFloat(variant.price.amount)
        if (amount < filter.priceRange.min) return false
        if (amount > filter.priceRange.max) return false
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  })

  const filterMaterials = appConfig.product.materiels.filter((item) => {
    return filter.materials.includes(item.slug)
  })

  const filterColors = appConfig.product.colors.filter((item) => {
    return filter.colors.includes(item.slug)
  })

  const filterMethods = appConfig.product.methods.filter((item) => {
    return filter.methods.includes(item.slug)
  })

  const filterVenders = appConfig.product.brands.filter((item) => {
    return filter.brands.includes(item.slug)
  })

  const filterScenes = appConfig.product.cases.filter((item) => {
    return filter.scenes.includes(item.slug)
  })

  const filtersCount =
    filterMaterials.length +
    filterColors.length +
    filterMethods.length +
    filterVenders.length +
    filterScenes.length

  const hasFilters = 0 < filtersCount

  return (
    <main className="container space-y-4">
      <CustomBreadcrumb items={[{ title: pageName, href: "/products" }]} />
      <div className="flex gap-x-16">
        <ProductFilterAside
          category={
            <ProductCategoryFilter
              value={filter.category}
              onChangeCategory={filter.setCategory}
            />
          }
          material={
            <ProductMaterialFilter
              values={filter.materials}
              onCheckAll={filter.addAllMaterials}
              onCheck={filter.addMaterial}
            />
          }
          color={
            <ProductColorFilter
              values={filter.colors}
              onCheck={filter.addColor}
            />
          }
          price={
            <ProductPriceFilter
              min={filter.priceRange.min}
              max={filter.priceRange.max}
              onChange={filter.setPriceRange}
            />
          }
          process={
            <ProductMethodFilter
              values={filter.methods}
              onCheck={filter.addMethod}
              onCheckAll={filter.addAllMethods}
            />
          }
          brand={
            <ProductBrandFilter
              values={filter.brands}
              onCheck={filter.addBrand}
              onCheckAll={filter.addAllBrands}
            />
          }
          scene={
            <ProductSceneFilter
              values={filter.scenes}
              onCheck={filter.addScene}
            />
          }
        />
        <div className="w-full space-y-4">
          <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
            <h1>{pageName}</h1>
            <div className="flex items-center justify-between">
              <ProductFilterDialogButton
                onReset={filter.reset}
                category={
                  <ProductCategoryFilter
                    value={filter.category}
                    onChangeCategory={filter.setCategory}
                  />
                }
                material={
                  <ProductMaterialFilter
                    values={filter.materials}
                    onCheckAll={filter.addAllMaterials}
                    onCheck={filter.addMaterial}
                  />
                }
                color={
                  <ProductColorFilter
                    values={filter.colors}
                    onCheck={filter.addColor}
                  />
                }
                price={
                  <ProductPriceFilter
                    min={filter.priceRange.min}
                    max={filter.priceRange.max}
                    onChange={filter.setPriceRange}
                  />
                }
                process={
                  <ProductMethodFilter
                    values={filter.methods}
                    onCheck={filter.addMethod}
                    onCheckAll={filter.addAllMethods}
                  />
                }
                brand={
                  <ProductBrandFilter
                    values={filter.brands}
                    onCheck={filter.addBrand}
                    onCheckAll={filter.addAllBrands}
                  />
                }
                scene={
                  <ProductSceneFilter
                    values={filter.scenes}
                    onCheck={filter.addScene}
                  />
                }
              />
              <ProductSortSelect />
            </div>
          </div>
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {filterMaterials.map((item) => (
                <FilterButton
                  key={item.slug}
                  onClick={() => {
                    filter.addMaterial(item.slug)
                  }}
                >
                  {item.name}
                </FilterButton>
              ))}
              {filterColors.map((item) => (
                <FilterButton
                  key={item.slug}
                  onClick={() => {
                    filter.addColor(item.slug)
                  }}
                >
                  {item.label}
                </FilterButton>
              ))}
              {filterMethods.map((item) => (
                <FilterButton
                  key={item.slug}
                  onClick={() => {
                    filter.addMethod(item.slug)
                  }}
                >
                  {item.name}
                </FilterButton>
              ))}
              {filterVenders.map((item) => (
                <FilterButton
                  key={item.slug}
                  onClick={() => {
                    filter.addBrand(item.slug)
                  }}
                >
                  {item.name}
                </FilterButton>
              ))}
              {filterScenes.map((item) => (
                <FilterButton
                  key={item.slug}
                  onClick={() => {
                    filter.addScene(item.slug)
                  }}
                >
                  {item.name}
                </FilterButton>
              ))}
              <Button
                variant={"ghost"}
                className="rounded-full"
                onClick={filter.reset}
              >
                {"条件をクリア"}
              </Button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={getImageLoadingPriority(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {
    /**
     * Get all products
     */
    pageBy: 128, // PAGINATION_SIZE,
  })

  const data = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  })

  invariant(data, "No data returned from Shopify API")

  const seoConfig = {
    title: "全てのアイテム",
    description: "全てのアイテム",
    titleTemplate: "%s | コレクション",
    // TODO: JsonLd
    // jsonLd: collectionJsonLd({ collection, url: request.url }),
  } satisfies SeoConfig

  return json({
    seoConfig,
    products: data.products,
  })
}

export const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const
