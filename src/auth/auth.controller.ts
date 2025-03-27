import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpUserDto } from './auth.dto';
import { TenantDB } from '@shared/decorators/tenant.decorator';
import { DataSource } from 'typeorm';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    description: 'auth sign-in-admin',
    type: SignInDto,
  })
  @Post('sign-in-admin')
  signInAdmin(@Body() dto: SignInDto) {
    return this.authService.signInAdmin(dto);
  }

  @ApiHeader({ name: 'x-tenant-id' })
  @ApiBody({
    description: 'auth sign-up-user',
    type: SignUpUserDto,
  })
  @Post('sign-up-user')
  signUpUser(@Body() dto: SignUpUserDto) {
    return this.authService.signUpUser(dto);
  }

  @ApiHeader({ name: 'x-tenant-id' })
  @ApiBody({
    description: 'auth sign-in-user',
    type: SignInDto,
  })
  @Post('sign-in-user')
  signInUser(@Body() dto: SignInDto) {
    return this.authService.signInUser(dto);
  }
}
