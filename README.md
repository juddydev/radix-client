# UNINOVERSE

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to
dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework.
This template contains a **full-featured setup** of components, queries and
tooling to get started with Hydrogen

https://github.com/Shopify/hydrogen-demo-store

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
$ bun i
```

Remember to update `.env` with your shop's domain and Storefront API token!

## Building for production

```bash
$ bun run build
```

## Local development

```bash
$ bun run dev
```

## Setup for using Customer Account API (`/account` section)

### Setup public domain using ngrok

1. Setup a [ngrok](https://ngrok.com/) account and add a permanent domain (ie.
   `https://<your-ngrok-domain>.app`).
1. Install the [ngrok CLI](https://ngrok.com/download) to use in terminal
1. Start ngrok using `ngrok http --domain=<your-ngrok-domain>.app 3000`
