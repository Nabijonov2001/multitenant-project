import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantEntity } from 'src/entities/tenants.entity';
import { CreateTenantDto, UpdateTenantDto } from './tenants.dto';

@Injectable()
export class TenantsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(TenantEntity) private readonly tenantRepo: Repository<TenantEntity>,
  ) {}

  async create(dto: CreateTenantDto) {
    const newTenant = new TenantEntity();

    Object.assign(newTenant, dto);

    const tenant = await this.tenantRepo.save(newTenant);

    await this.dataSource.query(`CREATE DATABASE ${tenant.dbName}`);

    return tenant;
  }

  async findAll({ offset = 0, limit = 20 }) {
    const [tenants, totalCount] = await this.tenantRepo.findAndCount({
      skip: offset,
      take: limit,
    });

    return {
      tenants,
      totalCount,
    };
  }

  async findOne(id: string) {
    const findTenant = await this.tenantRepo.findOne({ where: { id } });
    if (!findTenant) {
      throw new NotFoundException('Tenant not found');
    }

    return findTenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    const findTenant = await this.tenantRepo.findOne({ where: { id } });
    if (!findTenant) {
      throw new NotFoundException('Tenant not found');
    }

    Object.assign(findTenant, dto);

    return this.tenantRepo.save(findTenant);
  }

  async remove(id: string) {
    const findTenant = await this.tenantRepo.findOne({ where: { id } });
    if (!findTenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.tenantRepo.delete({ id });

    return { success: true };
  }
}
