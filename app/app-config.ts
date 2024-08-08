export const appConfig = {
  features: {
    languageSwitcher: false,
    login: true,
    search: false,
    cart: true,
    aboutMaterial: false,
    orderDetail: false,
  },
  site: {
    name: "UNINOVERSE",
  },
  product: {
    /**
     * カテゴリ
     */
    categories: [
      {
        name: "革靴",
        slug: "leather-shoes",
        children: [
          { name: "オックスフォード", slug: "oxford" },
          { name: "ローファー", slug: "loafer" },
          { name: "ブーツ", slug: "boots" },
        ],
      },
      {
        name: "スニーカー",
        slug: "sneakers",
        children: [{ name: "スニーカー", slug: "b1" }],
      },
      {
        name: "ゴルフシューズ",
        slug: "golf-shoes",
        children: [{ name: "ゴルフシューズ", slug: "c1" }],
      },
      {
        name: "ゴルフウェア",
        slug: "golf-wear",
        children: [{ name: "ゴルフウェア", slug: "d1" }],
      },

      {
        name: "インソール",
        slug: "insole",
        children: [{ name: "インソール", slug: "e1" }],
      },
    ] as const,
    /**
     * カラー
     */
    colors: [
      { label: "ブラック", slug: "black" },
      { label: "オフホワイト", slug: "off-white" },
      { label: "グレー", slug: "gray" },
      { label: "アンティークグレー", slug: "antique-gray" },
      { label: "グリーン", slug: "green" },
      { label: "ワインレッド", slug: "wine-red" },
      { label: "ピンク", slug: "pink" },
      { label: "ブラウン", slug: "brown" },
      { label: "ダークブラウン", slug: "dark-brown" },
    ] as const,

    /**
     * 素材
     */
    materiels: [
      // { name: "カーフスキン", slug: "calfskin" },
      {
        name: "クロコダイル（腹）",
        slug: "crocodile-belly",
      },
      // { name: "西德皮", slug: "cordovan" },
      // { name: "篮球皮", slug: "basketball" },
      { name: "カーフスエード", slug: "calf-suede" },
      { name: "カーフレザー（防水）", slug: "calf-leather-waterproof" },
      // { name: "ディア", slug: "deer" },
      { name: "オーストリッチ", slug: "ostrich" },
      { name: "バロンレザー", slug: "baron" },
      // { name: "カンガルー", slug: "kangaroo" },
      // { name: "甩纹牛皮", slug: "pebble-grain" },
      { name: "スコッチグレン", slug: "scotch-grain" },
    ],
    methods: [
      { name: "セメント", slug: "cement" },
      { name: "グッドイヤー", slug: "goodyear" },
      { name: "ノルウィージャン", slug: "norwegian" },
    ],
    brands: [
      { name: "FUJI UNI", slug: "fuji-uni" },
      { name: "UNINOVERSE", slug: "uninoverse" },
      { name: "UNI PREMIUM", slug: "uni-premium" },
    ],
    cases: [
      { name: "ビジネス", slug: "business" },
      { name: "ゴルフ", slug: "golf" },
      { name: "結婚式・パーティー", slug: "wedding-party" },
      { name: "カジュアル", slug: "casual" },
    ],
  },
}
