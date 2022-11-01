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
    mail: {
      from_mail: process.env.MAIL_FROM_ADDRESS,
      aws_ses_access_key_id: process.env.AWS_SES_ACCESS_KEY_ID,
      aws_region: process.env.AWS_SES_DEFAULT_REGION,
      aws_ses_secret_access_key: process.env.AWS_SES_SECRET_ACCESS_KEY,
    },
  };
};
