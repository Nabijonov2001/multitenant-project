import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICurrentUser } from '@shared/interfaces/user.interface';

@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
  @Inject() private jwtService: JwtService;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Token is required!');
    }

    if (token.startsWith('Bearer ')) {
      token = token.substring('Bearer '.length);
    }

    const user = await this.jwtService.verifyAsync<ICurrentUser>(token, {
      secret: `${String(process.env.JWT_SECRET)}`,
    });

    if (user.role !== 'ADMIN') {
      return false;
    }

    user.lang = request.headers['Accept-Language'] || 'uz';

    request.user = user;

    return true;
  }
}
