import { User } from "../../prisma/generated/prisma/client";
import { hassPassword } from "../helpers/passportHasher";
import { validatePassword } from "../helpers/passwordValidator";

export async function register(body: any, prisma: any): Promise<string | User> {
  const { username, email, password } = body;

  // Validate password requirements
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation.errors.join("; ");
  }

  const hashedPassword = await hassPassword(password);

  const emailExists = await prisma.user.findUnique({ where: { email } });

  if (emailExists) {
    return "Email already in use";
  }

  const userNameExists = await prisma.user.findUnique({ where: { username } });

  if (userNameExists) {
    return "Username already in use";
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return user;
}
