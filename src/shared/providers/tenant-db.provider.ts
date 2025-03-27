import { DataSource, DataSourceOptions } from 'typeorm';
import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { TenantEntity } from 'src/entities/tenants.entity';
import { UserEntity } from 'src/entities/users.entity';
import { LRUCache } from 'lru-cache';

@Injectable()
export class TenantDBProvider implements OnApplicationShutdown {
  private readonly logger = new Logger(TenantDBProvider.name);
  private tenantCache = new LRUCache<string, DataSource>({
    max: 100,
    ttl: 1000 * 60 * 5,
    dispose: async (connection, tenantId) => {
      await connection.destroy();
      this.logger.log(`Closed expired tenant DB connection: ${tenantId}`);
    },
  });

  async getTenantConnection(tenantId: string, tenantData: TenantEntity): Promise<DataSource> {
    if (this.tenantCache.has(tenantId)) {
      return this.tenantCache.get(tenantId) as DataSource;
    }

    try {
      const newConnection = new DataSource({
        type: 'postgres',
        host: tenantData.dbHost,
        database: tenantData.dbName,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        entities: [UserEntity],
        synchronize: process.env.DB_SYNC,
        extra: {
          max: 20,
        },
      } as DataSourceOptions);

      await newConnection.initialize();
      this.tenantCache.set(tenantId, newConnection);
      this.logger.log(`New tenant DB connection created: ${tenantId}`);

      return newConnection;
    } catch (error) {
      this.logger.error(`Error creating database for tenant: ${tenantId}`, error);
      throw error;
    }
  }

  async onApplicationShutdown() {
    for (const [tenantId, connection] of this.tenantCache.entries()) {
      await connection.destroy();
      this.logger.log(`Closed tenant DB connection on shutdown: ${tenantId}`);
    }
  }
}
