export interface AuthenticatedUser {
  userId: number;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}

export interface AppContext {
  Variables: {
    user?: AuthenticatedUser;
  };
}
