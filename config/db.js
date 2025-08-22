import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(' DB connected');
  } catch (e) {
    console.error(' DB connection failed:', e.message);
    process.exit(1);
  }
}
