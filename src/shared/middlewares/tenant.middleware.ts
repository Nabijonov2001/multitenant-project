import { Injectable, NestMiddleware, Req, Res, Next, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantsService } from 'src/tenants/tenants.service';
import { TenantDBProvider } from '@shared/providers/tenant-db.provider';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly tenantDBProvider: TenantDBProvider,
  ) {}

  async use(@Req() req, @Res() res, @Next() next) {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('Tenant id is required');
    }

    const tenantData = await this.tenantsService.findOne(tenantId);
    if (!tenantData) {
      throw new NotFoundException('Tenant not found');
    }

    req.db = await this.tenantDBProvider.getTenantConnection(tenantId, tenantData);

    next();
  }
}
