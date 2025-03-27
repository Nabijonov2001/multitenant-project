import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SignInDto, SignUpUserDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { AdminEntity } from 'src/entities/admins.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(AdminEntity) private readonly adminRepo: Repository<AdminEntity>,
    @Inject('TENANT_CONNECTION') private readonly tenantConnection: DataSource,
  ) {}

  async signInAdmin({ phone, password }: SignInDto) {
    const findAdmin = await this.adminRepo.findOne({ where: { phone } });
    if (!findAdmin) {
      throw new NotFoundException('Admin not found');
    }

    const isPasswordMatch = await compare(password, findAdmin.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Password or phone is incorrect');
    }

    //@ts-ignore
    delete findAdmin.password;

    const payload = { _id: findAdmin.id, phone: findAdmin.phone, role: 'ADMIN' };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '48h' });

    return { token, admin: findAdmin };
  }

  async signUpUser(dto: SignUpUserDto) {
    const userRepo = this.tenantConnection.getRepository(UserEntity);
    const findUser = await userRepo.findOne({ where: { phone: dto.phone } });
    if (findUser) {
      throw new BadRequestException('User already registered');
    }

    const newUser = new UserEntity();
    Object.assign(newUser, dto);

    const createUser = await userRepo.save(newUser);

    //@ts-ignore
    delete createUser.password;

    const payload = { _id: createUser.id, phone: createUser.phone, type: 'USER' };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '48h' });

    return { token, user: createUser };
  }

  async signInUser({ phone, password }: SignInDto) {
    const userRepo = this.tenantConnection.getRepository(UserEntity);
    const findUser = await userRepo.findOne({ where: { phone } });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await compare(password, findUser.password);
    if (!isPasswordMatch) {
      throw new NotFoundException('Password or phone is incorrect');
    }

    //@ts-ignore
    delete findUser.password;

    const payload = { _id: findUser.id, phone: findUser.phone, type: 'USER' };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '48h' });

    return { token, user: findUser };
  }
}
