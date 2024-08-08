import { Hono } from "hono"
import { hc } from "hono/client"
import { vValidator } from "@hono/valibot-validator"
import {
  array,
  nullable,
  number,
  object,
  optional,
  parse,
  string,
} from "valibot"

const hono = new Hono()

const vStock = object({
  storeId: string(),
  productId: string(),
  stockAmount: string(),
  layawayStockAmount: string(),
  updDateTime: string(),
})

const vProduct = object({
  productId: string(),
  categoryId: string(),
  productCode: string(),
  productName: string(),
  productKana: nullable(string()),
  taxDivision: string(),
  productPriceDivision: nullable(string()),
  price: nullable(string()),
  customerPrice: nullable(number()),
  cost: nullable(number()),
  attribute: nullable(string()),
  description: nullable(string()),
  catchCopy: nullable(string()),
  size: nullable(string()),
  color: nullable(string()),
  tag: nullable(string()),
  groupCode: nullable(string()),
  url: nullable(string()),
  printReceiptProductName: nullable(string()),
  displaySequence: nullable(string()),
  salesDivision: nullable(string()),
  stockControlDivision: nullable(string()),
  displayFlag: nullable(string()),
  division: nullable(string()),
  productOptionGroupId: nullable(string()),
  pointNotApplicable: nullable(string()),
  taxFreeDivision: nullable(string()),
  supplierProductNo: nullable(string()),
  calcDiscount: nullable(string()),
  staffDiscountRate: nullable(string()),
  useCategoryReduceTax: nullable(string()),
  reduceTaxId: nullable(string()),
  reduceTaxPrice: nullable(string()),
  reduceTaxCustomerPrice: nullable(string()),
  orderPoint: nullable(string()),
  purchaseCost: nullable(string()),
  appStartDateTime: nullable(string()),
  insDateTime: string(),
  updDateTime: string(),
})

const baseURL = "https://api.smaregi.jp"

const app = hono
  .get(
    "/:id/pos/products",
    vValidator("header", object({ authorization: string() })),
    vValidator(
      "query",
      object({
        group_code: optional(string()),
      }),
    ),
    async (c) => {
      const query = c.req.valid("query")
      const header = c.req.valid("header")
      const input = new URL(`${baseURL}${c.req.path}`)
      for (const [name, value] of Object.entries(query)) {
        input.searchParams.append(name, value)
      }
      const resp = await fetch(input, {
        headers: { authorization: header.authorization },
      })
      const json = await resp.json()
      return c.json(parse(array(vProduct), json))
    },
  )
  .get(
    "/:id/pos/products/:product",
    vValidator("header", object({ authorization: string() })),
    async (c) => {
      const header = c.req.valid("header")
      const resp = await fetch(`${baseURL}${c.req.path}`, {
        headers: { authorization: header.authorization },
      })
      const json = await resp.json()
      console.log("json", json)
      return c.json(parse(vProduct, json))
    },
  )
  .patch(
    "/:id/pos/products/:product",
    vValidator("header", object({ authorization: string() })),
    vValidator(
      "json",
      object({
        /**
         * グルーピングする為の一意のキー (親の商品IDになる)
         */
        groupCode: string(),
      }),
    ),
    async (c) => {
      const header = c.req.valid("header")
      const validJson = c.req.valid("json")
      const resp = await fetch(`${baseURL}${c.req.path}`, {
        method: "PATCH",
        headers: { authorization: header.authorization },
        body: JSON.stringify(validJson),
      })
      const json = await resp.json()
      if (resp.status !== 200) {
        throw new Error(JSON.stringify(json))
      }
      return c.json(parse(vProduct, json))
    },
  )
  .get(
    "/:id/pos/stock",
    vValidator("header", object({ authorization: string() })),
    vValidator("query", object({ product_id: optional(nullable(string())) })),
    async (c) => {
      const header = c.req.valid("header")
      const query = c.req.valid("query")
      const input = new URL(`${baseURL}${c.req.path}`)
      for (const [name, value] of Object.entries(query)) {
        if (value === null) continue
        input.searchParams.append(name, value)
      }
      const resp = await fetch(input, {
        headers: { authorization: header.authorization },
      })
      const json = await resp.json()
      return c.json(parse(array(vStock), json))
    },
  )
  .get("/hello", async (c) => {
    return c.json({ hello: "world" })
  })

export const smaregi = hc<typeof app>("", {
  fetch(input: string | URL | Request, init?: RequestInit) {
    return app.request(input, init)
  },
})
