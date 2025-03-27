import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { AdminEntity } from 'src/entities/admins.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto, UpdateAdminDto } from './admins.dto';
import { ICurrentUser } from '@shared/interfaces/user.interface';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(AdminEntity) private readonly adminRepo: Repository<AdminEntity>) {}

  async create(dto: CreateAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { phone: dto.phone } });
    if (admin) {
      throw new BadRequestException('Admin already registered');
    }

    const newAdmin = new AdminEntity();
    Object.assign(newAdmin, dto);

    const createAdmin = await this.adminRepo.save(newAdmin);

    //@ts-ignore
    delete createAdmin.password;

    return createAdmin;
  }

  async findAll({ offset = 0, limit = 20 }) {
    const [admins, totalCount] = await this.adminRepo.findAndCount({
      skip: offset,
      take: limit,
      select: ['id', 'fullName', 'phone', 'createdAt', 'updatedAt'],
    });

    return {
      admins,
      totalCount,
    };
  }

  async findOne(id: string) {
    const findAdmin = this.adminRepo.findOne({ where: { id } });
    if (!findAdmin) {
      throw new NotFoundException('Admin not found');
    }

    return findAdmin;
  }

  async update(id: string, dto: UpdateAdminDto, user: ICurrentUser) {
    if (user.id !== id) {
      throw new BadRequestException('You can only update your own account');
    }

    const findAdmin = await this.adminRepo.findOne({ where: { id } });
    if (!findAdmin) {
      throw new NotFoundException('Admin not found');
    }

    if (dto.newPassword) {
      const isPasswordMatch = await compare(dto.password, findAdmin.password);
      if (!isPasswordMatch) {
        throw new BadRequestException('Password is incorrect');
      }

      dto.password = dto.newPassword;
    }

    Object.assign(findAdmin, dto);
    const updatedUser = await this.adminRepo.save(findAdmin);

    //@ts-ignore
    delete updatedUser.password;

    return updatedUser;
  }

  async remove(id: string) {
    const findAdmin = await this.adminRepo.findOne({ where: { id } });
    if (!findAdmin) {
      throw new NotFoundException('Admin not found');
    }

    await this.adminRepo.delete({ id });

    return { success: true };
  }
}
