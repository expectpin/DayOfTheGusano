export default {
  typeorm: {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'usermanagement',
  },
};
