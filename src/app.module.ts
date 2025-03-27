import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, AdminsModule, TenantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
