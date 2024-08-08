import { Hono } from "hono"
import { hc } from "hono/client"
import { vValidator } from "@hono/valibot-validator"
import { number, object, parse, string } from "valibot"

const hono = new Hono()

const app = hono
  .post(
    "/app/:id/token",
    vValidator("header", object({ authorization: string() })),
    vValidator(
      // TODO: formだと破損した
      "json",
      object({
        grant_type: string(),
        scope: string(),
      }),
    ),
    async (c) => {
      const id = c.req.param("id")
      const header = c.req.valid("header")
      const form = c.req.valid("json")
      const formData = new URLSearchParams(Object.entries(form))
      const resp = await fetch(`https://id.smaregi.jp/app/${id}/token`, {
        method: "POST",
        body: formData.toString(),
        headers: {
          authorization: header.authorization,
          "content-type": "application/x-www-form-urlencoded",
        },
      })
      const json = await resp.json()
      if (resp.ok === false) {
        throw new Error(JSON.stringify(json))
      }
      const schema = object({
        scope: string(),
        token_type: string(),
        expires_in: number(),
        access_token: string(),
      })
      return c.json(parse(schema, json))
    },
  )
  .get("/hello", async (c) => {
    return c.json({ hello: "world" })
  })

export const smaregiId = hc<typeof app>("", {
  fetch(input: string | URL | Request, init?: RequestInit) {
    return app.request(input, init)
  },
})
