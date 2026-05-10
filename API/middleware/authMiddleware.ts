import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/context";

export async function authMiddleware(c: any, next: any) {

  // verify if the request has a bearer token in the header, if not return 401 unauthorized
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  // verify the token, if invalid return 401 unauthorized
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser;
    c.set("user", decoded);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}
