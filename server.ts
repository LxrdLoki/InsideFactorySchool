import { Hono } from "hono";
import "dotenv/config";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server'
import { PrismaClient } from "./prisma/generated/prisma/client.ts"
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { scrapeForexFactory } from './API/scrapers/forexfactory.ts'
import { processTransactions } from "./API/scrapers/processOpenInsider.ts";
import { register } from "./API/authentication/register.ts";
import jwt from "jsonwebtoken";
import { login } from "./API/authentication/login.ts";


const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const app = new Hono()
app.use('*', cors());

app.get('/calendar/:week', async (c) => {
  const weekNumber = Number(c.req.param('week'));
  const data = await scrapeForexFactory(weekNumber);

  if (data) {
    return c.json(data)
  }

  return c.json({ error: "Failed to scrape data" }, 500)
})

app.get('/insiderTrades', async (c) => {
  const data = await processTransactions(prisma);

  if (data) {
    return c.json(data)
  }

  return c.json({ error: "Failed to scrape data" }, 500)
})

app.post('/register', async (c) => {
  const body = await c.req.json();

  const user = await register(body, prisma);

  if (typeof user === "string") {
    return c.json({ error: user }, 400);
  }

  return c.json(user);
});

app.post('/login', async (c) => {
  const body = await c.req.json();

  const user = await login(body, prisma);

  if (typeof user === "string") {
    return c.json({ error: user }, 400);
  }


  return c.json(user);
});

serve({
  fetch: app.fetch,
  port: 3000
})
