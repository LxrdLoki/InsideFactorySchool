import { AuthenticatedUser } from "../types/context";

export function requireRole(requiredRole: "USER" | "ADMIN") {
  return async (c: any, next: any) => {
    const user = c.get("user") as AuthenticatedUser | undefined;

    // not logged in, return 401 unauthorized
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // admin can access all routes
    if (user.role === "ADMIN") {
      return await next();
    }

    // user can only access specific routes for users
    if (requiredRole === "USER" && user.role === "USER") {
      return await next();
    }

    // if the user does not have the required role, return 403 forbidden
    return c.json({ error: "Forbidden" }, 403);
  };
}
