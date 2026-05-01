import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(body: any, prisma: any) {
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return "Invalid credentials";
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return "Invalid credentials";
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return { token };
}
