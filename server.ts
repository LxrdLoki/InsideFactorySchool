import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server'

const app = new Hono()
app.use('*', cors());

app.get('/', async (c) => {


  return c.json("testdata!")
})
serve({
  fetch: app.fetch,
  port: 3000
})
