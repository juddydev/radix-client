import { MEDIA_FRAGMENT } from "~/graphql/fragments"
import { PRODUCT_VARIANT_FRAGMENT } from "~/routes/($locale).products.$handle._index/graphql/product-variant-fragment"

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      materials: metafield(key: "materials", namespace: "custom") {
        id
        value
      }
      maintenance: metafield(key: "maintenance", namespace: "custom") {
        id
        value
      }
      country_of_origin: metafield(key: "country_of_origin", namespace: "custom") {
        id
        value
      }
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariantFragment
      }
      media(first: 100) {
        nodes {
          id
          alt
          ...Media
          ... on MediaImage {
            id
            image {
              id
              url
            }
          }
          ... on Model3d {
            id
            sources {
              url
            }
          }
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
      customMadeAccessories: metafield(key: "custom_made_accessory", namespace: "custom") {
        id
        value
        references(first: 16) {
          nodes {
            ... on Product {
              id
              title
              handle
              variants(first: 16) {
                nodes {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      customMadeMaterial: metafield(key: "custom_made_material", namespace: "custom") {
        id
        value
        reference {
          ... on Product {
            id
            title
            handle
            variants(first: 16) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      customMadeSole: metafield(key: "custom_made_sole", namespace: "custom") {
        id
        value
        reference {
          ... on Product {
            id
            title
            handle
            variants(first: 16) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const
