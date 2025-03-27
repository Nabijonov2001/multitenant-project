import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
} as DataSourceOptions);

dataSource
  .initialize()
  .then(() => console.log('Master DB Connected'))
  .catch((err) => console.error('Error Connecting Master DB', err));
