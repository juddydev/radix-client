export const SHOP_QUERY = `#graphql
  query shop(
    $language: LanguageCode
  ) @inContext(language: $language) {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
  }
` as const
