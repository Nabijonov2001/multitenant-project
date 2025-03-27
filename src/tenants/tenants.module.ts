import { BadRequestException, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { TenantEntity } from 'src/entities/tenants.entity';
import { TenantDBProvider } from '@shared/providers/tenant-db.provider';
import { REQUEST } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity]), SharedModule],
  controllers: [TenantsController],
  providers: [
    {
      provide: 'TENANT_CONNECTION',
      inject: [REQUEST, TenantsService, TenantDBProvider],
      useFactory: async (request: any, service: TenantsService, provider: TenantDBProvider) => {
        const tenantId = request.headers['x-tenant-id'];
        if (!tenantId) throw new BadRequestException('Tenant ID is missing');

        const tenantData: TenantEntity = await service.findOne(tenantId);

        return provider.getTenantConnection(tenantId, tenantData);
      },
    },
    TenantsService,
    TenantDBProvider,
  ],
  exports: ['TENANT_CONNECTION', TenantsService, TenantDBProvider],
})
export class TenantsModule {}
