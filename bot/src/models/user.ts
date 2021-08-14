import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Default,
  AllowNull,
  Index,
  AutoIncrement,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

import { Server } from './server';

interface UserAttributes {
  id: number;
  discordId: string;
  server: Server;
  serverId: string;
  isAdmin: boolean;
  isBlocked: boolean;
  lang: string;
  raterLang: string;
  raterLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'server' | 'isAdmin' | 'isBlocked' | 'lang' | 'raterLang' | 'raterLimit' | 'createdAt' | 'updatedAt'
  > {}

@Table({ tableName: 'user' })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Index
  @Column
  discordId: string;

  @BelongsTo(() => Server)
  server: Server;

  @ForeignKey(() => Server)
  @Column
  serverId: string;

  @AllowNull(false)
  @Default(false)
  @Column
  isAdmin: boolean;

  @AllowNull(false)
  @Default(false)
  @Column
  isBlocked: boolean;

  @AllowNull(false)
  @Default('en')
  @Column
  lang: string;

  @AllowNull(false)
  @Default('en')
  @Column
  raterLang: string;

  @AllowNull(false)
  @Default(25)
  @Column
  raterLimit: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}