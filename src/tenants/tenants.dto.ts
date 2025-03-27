import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public dbHost: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public dbName: string;
}

export class UpdateTenantDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public name: string;
}

export class TenantListDto {
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
