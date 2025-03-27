import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from '@shared/interfaces/user.interface';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as ICurrentUser;
});
