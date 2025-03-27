import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class SignInDto {
  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
