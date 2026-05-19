import { Hono } from "hono";
import "dotenv/config";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server'
import { PrismaClient, ForumCategory } from "./prisma/generated/prisma/client.ts"
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { scrapeForexFactory } from './API/scrapers/forexfactory.ts'
import { processTransactions } from "./API/scrapers/processOpenInsider.ts";
import { register } from "./API/authentication/register.ts";
import jwt from "jsonwebtoken";
import { login } from "./API/authentication/login.ts";
import { createRateLimiter } from "./API/middleware/rateLimitMiddleware.ts";
import { authMiddleware } from "./API/middleware/authMiddleware.ts";
import { requireRole } from "./API/middleware/roleMiddleware.ts";
import { createPost } from "./API/forum/createPost.ts";
import { getAuthenticatedUser } from "./API/helpers/contextHelper.ts";
import { getPosts } from "./API/forum/getPosts.ts";
import { getPost } from "./API/forum/getSinglePost.ts";
import { createComment } from "./API/forum/createComment.ts";
import { deletePost } from "./API/forum/deletePost.ts";
import { deleteComment } from "./API/forum/deleteComment.ts";
import { upVotePost } from "./API/forum/upVotePost.ts";
import { downVotePost } from "./API/forum/downVotePost.ts";


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

// this will be 5 attempts per 15 minutes for all auth routes (register and login) to prevent brute force attacks
const authRateLimiter = createRateLimiter(5, 15 * 60 * 1000);
// the general rate limiter (used on all post requests) allows max 600 requests per minute (10 per second) to prevent DoS attacks
const generalRateLimiter = createRateLimiter(600, 1 * 60 * 1000);

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

app.post('/register', authRateLimiter, async (c) => {
  const body = await c.req.json();

  const user = await register(body, prisma);

  if (typeof user === "string") {
    return c.json({ error: user }, 400);
  }

  return c.json(user);
});

app.post('/login', authRateLimiter, async (c) => {
  const body = await c.req.json();

  const result = await login(body, prisma);

  if ("error" in result) {
    return c.json(result, 401);
  }


  return c.json(result);
});

app.post("/forum/createPost", generalRateLimiter, authMiddleware, requireRole("USER"), async (c) => {
  const body = await c.req.json();

  const user = getAuthenticatedUser(c);

  const newPost = await createPost(body, prisma, user.userId);

  if (newPost.error) {
    return c.json({ error: newPost.error }, 400);
  }

  return c.json(newPost);
});

app.get('/forum/:category', async (c) => {

  const category = c.req.param('category');

  const posts = await getPosts(prisma, category)

  return c.json(posts);
});

app.get("/forum/posts/:id", async (c) => {

  const id = Number(c.req.param("id"));

  const post = await getPost(prisma, id);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

app.post("/forum/posts/:id/comments", generalRateLimiter, authMiddleware, requireRole("USER"), async (c) => {

  const body = await c.req.json();

  const postId = Number(c.req.param("id"));

  const user = getAuthenticatedUser(c);

  const comment = await createComment(
    body,
    prisma,
    user.userId,
    postId
  );

  if (comment.error) {
    return c.json({ error: comment.error }, 400);
  }

  return c.json(comment);
});

app.delete("/forum/posts/:id", authMiddleware, requireRole("USER"), async (c) => {

  const postId = Number(c.req.param("id"));

  const user = getAuthenticatedUser(c);

  const result = await deletePost(
    prisma,
    postId,
    user
  );

  if (result.error) {
    return c.json({ error: result.error }, 403);
  }

  return c.json(result);
});

app.delete("/forum/comments/:id", authMiddleware, requireRole("USER"), async (c) => {

  const commentId = Number(c.req.param("id"));
  const user = getAuthenticatedUser(c);

  const result = await deleteComment(
    prisma,
    commentId,
    user
  );

  if (result.error) {
    return c.json({ error: result.error }, 403);
  }

  return c.json(result);
});

app.post("/forum/posts/:id/upvote", generalRateLimiter, authMiddleware, requireRole("USER"), async (c) => {

  const postId = Number(c.req.param("id"));
  const user = getAuthenticatedUser(c);

  const result = await upVotePost(
    prisma,
    postId,
    user.userId
  );

  if (result.error) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(result);
});

app.post("/forum/posts/:id/downvote", generalRateLimiter, authMiddleware, requireRole("USER"), async (c) => {

  const postId = Number(c.req.param("id"));
  const user = getAuthenticatedUser(c);

  const result = await downVotePost(
    prisma,
    postId,
    user.userId
  );

  if (result.error) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(result);
});

serve({
  fetch: app.fetch,
  port: 3000
})
