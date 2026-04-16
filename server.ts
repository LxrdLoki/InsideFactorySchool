import { Hono } from "hono";
import "dotenv/config";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server'
import { PrismaClient } from "./prisma/generated/prisma/client.ts"
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { scrapeForexFactory } from './API/scrapers/forexfactory.ts'


// const adapter = new PrismaMariaDb({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   connectionLimit: 5,
// });
// const prisma = new PrismaClient({ adapter });

const app = new Hono()
app.use('*', cors());

// app.get('/', async (c) => {

//   const lootdropper = await prisma.testdata.findMany()
//   return c.json(lootdropper)
// })

app.get('/calendar', async (c) => {
  const data = await scrapeForexFactory()
  console.log(data)
  if (data) {
    return c.json(data)
  }

  return c.json({ error: "Failed to scrape data" }, 500)
})

serve({
  fetch: app.fetch,
  port: 3000
})
