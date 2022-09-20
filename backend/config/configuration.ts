/**
 * Configurations => env variables
 * @returns env variables
 */
export const configuration = () => {
  return {
    database: {
      url: process.env.DATABASE_URL,
    },
  };
};
