import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const TenantDB = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.db as DataSource;
});
