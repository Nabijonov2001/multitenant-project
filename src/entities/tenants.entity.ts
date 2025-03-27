import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('tenants')
export class TenantEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'db_host', type: 'varchar', default: 'localhost' })
  dbHost: string;

  @Column({ name: 'db_name', type: 'varchar' })
  dbName: string;
}
