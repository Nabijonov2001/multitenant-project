import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, TenantListDto, UpdateTenantDto } from './tenants.dto';
import { AdminAuthorizationGuard } from '@shared/guards/admin-authorization.guard';

@Controller('tenants')
@ApiTags('tenants')
@ApiBearerAuth('authorization')
@UseGuards(AdminAuthorizationGuard)
export class TenantsController {
  constructor(private readonly tenantService: TenantsService) {}

  @ApiBody({
    description: 'tenant create',
    type: CreateTenantDto,
  })
  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto);
  }

  @ApiQuery({ description: 'tenants list', required: false })
  @Get()
  findAll(@Query() query: TenantListDto) {
    return this.tenantService.findAll(query);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @ApiBody({
    description: 'tenant update-by-id',
    type: UpdateTenantDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantService.update(id, dto);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}
