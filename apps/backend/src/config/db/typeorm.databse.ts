import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const typeOrmCongig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
};
