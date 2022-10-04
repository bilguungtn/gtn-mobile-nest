/**
 * Configurations => env variables
 * @returns env variables
 */
export const configuration = () => {
  return {
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: +process.env.JWT_EXPIRES_IN,
      secretKey: '' + process.env.JWT_SECRET_KEY,
    },
    auth: {
      http_basic_username: process.env.HTTP_BASIC_USER,
      http_basic_password: process.env.HTTP_BASIC_PASS,
    },
  };
};
