import dotenv from 'dotenv';

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case 'production':
    path = `${__dirname}/../../.env.production`;
    break;
  case 'development':
    path = `${__dirname}/../../.env.development`;
    break;
  default:
    path = `${__dirname}/../../.env.local`;
}
dotenv.config({ path });

export default {
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV,
  DB: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  DROP_TABLE: process.env.DROP_TABLE === 'true',
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  SECRET_KEY: process.env.SECRET_KEY! as string,
  UI_ROUTE: [
    '/api/public',
    '/api/gambler',
    '/api/article',
    '/api/promotion',
    '/api/token',
  ],
  USERNAME_PREFIX: process.env.USERNAME_PREFIX!,
  ADMIN_PASS: process.env.ADMIN_PASS!,
  LINE_ACCESS_TOKEN: process.env.LINE_ACCESS_TOKEN!,
};
