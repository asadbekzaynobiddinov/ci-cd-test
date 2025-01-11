import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltsRound: number = 10;
  return await bcrypt.hash(password, saltsRound);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
