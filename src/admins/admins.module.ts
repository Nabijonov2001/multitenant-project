import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { AdminEntity } from 'src/entities/admins.entity';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), SharedModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
