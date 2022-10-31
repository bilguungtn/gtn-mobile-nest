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
    },
    auth: {
      http_basic_username: process.env.HTTP_BASIC_USER,
      http_basic_password: process.env.HTTP_BASIC_PASS,
    },
    auth0: {
      auth0_issuer_url: process.env.AUTH0_ISSUER_URL,
      auth0_audience: process.env.AUTH0_AUDIENCE,
    },
  };
};
