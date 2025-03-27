import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminEntity } from 'src/entities/admins.entity';
import { TenantEntity } from 'src/entities/tenants.entity';

ConfigModule.forRoot();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [AdminEntity, TenantEntity],
  synchronize: true,
};
