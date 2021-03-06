import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  BeforeInsert,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfile } from '../../user-profiles/user-profile.entity';
import { Role } from '../../roles/role.entity';
import { UserSocialAccount } from '../../user-social-accounts/user-social-account.entity';
import { UserToken } from './user-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public password: string;

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  public isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    nullable: false,
  })
  public updatedAt: Date;

  @Column({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  public deletedAt?: Date;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  public userProfile: UserProfile;

  @OneToMany(
    () => UserSocialAccount,
    (userSocialAccount) => userSocialAccount.user,
  )
  public userSocialAccounts: UserSocialAccount[];

  @OneToOne(() => UserToken, (userToken) => userToken.user)
  public userToken: UserToken;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_has_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  public roles: Role[];
}
