import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminListDto, CreateAdminDto, UpdateAdminDto } from './admins.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { ICurrentUser } from '@shared/interfaces/user.interface';
import { AdminAuthorizationGuard } from '@shared/guards/admin-authorization.guard';
import { CurrentUser } from '@shared/decorators/user.decorator';

@Controller('admins')
@ApiTags('admins')
@ApiBearerAuth('authorization')
@UseGuards(AdminAuthorizationGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @ApiBody({
    description: 'admins create',
    type: CreateAdminDto,
  })
  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.adminsService.create(dto);
  }

  @ApiQuery({ description: 'admins list', required: false })
  @Get()
  findAll(@Query() query: AdminListDto) {
    return this.adminsService.findAll(query);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @ApiBody({
    description: 'admins update-by-id',
    type: UpdateAdminDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto, @CurrentUser() user: ICurrentUser) {
    return this.adminsService.update(id, dto, user);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
