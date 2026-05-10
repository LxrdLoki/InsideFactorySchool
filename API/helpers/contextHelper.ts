import { AuthenticatedUser } from "../types/context";

/**
 * get the authenticated user from context.
 * throws an error if user is not found or not properly authenticated.
 */
export function getAuthenticatedUser(c: any): AuthenticatedUser {
  const user = c.get("user") as AuthenticatedUser | undefined;

  if (!user || !user.userId) {
    throw new Error("User not authenticated");
  }

  return user;
}

export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === "ADMIN";
}


export function isOwner(user: AuthenticatedUser, resourceOwnerId: number): boolean {
  return user.userId === resourceOwnerId || isAdmin(user);
}
