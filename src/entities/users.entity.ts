import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { hash } from 'bcryptjs';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ name: 'full_name', type: 'varchar' })
  fullName: string;

  @Column({ name: 'phone', type: 'varchar' })
  phone: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }
}
