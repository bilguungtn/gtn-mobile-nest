import * as bcrypt from 'bcrypt';

export const comparePasswords = async (
  userPassword: string,
  currentPassword: string,
) => {
  return await bcrypt.compare(currentPassword, userPassword);
};
