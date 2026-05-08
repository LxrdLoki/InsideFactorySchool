import bcrypt from 'bcrypt';

export async function hassPassword(password: string): string {
  const saltRounds = process.env.SALT_ROUNDS!;
  const salt = bcrypt.genSaltSync(Number(saltRounds));
  return bcrypt.hashSync(password, salt);
}
