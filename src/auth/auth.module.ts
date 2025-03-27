import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from 'src/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { AdminEntity } from 'src/entities/admins.entity';
import { TenantsModule } from 'src/tenants/tenants.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AdminEntity]), SharedModule, TenantsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
