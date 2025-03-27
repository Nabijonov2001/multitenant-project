import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public fullName: string;

  @ApiProperty()
  @IsPhoneNumber()
  public phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;
}

export class UpdateAdminDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public fullName: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  public phone: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(6)
  public password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(6)
  public newPassword: string;
}

export class AdminListDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;
}
