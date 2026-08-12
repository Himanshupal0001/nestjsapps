import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
