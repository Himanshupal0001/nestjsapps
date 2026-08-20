import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbConfig } from './db.interface';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Module({})
export class DBModule {
  private static getConnectionOptions(
    config: ConfigService,
    dbconfig: DbConfig,
  ): TypeOrmModuleOptions {
    const databaseUrl = config.get('DATABASE_URL') as string;
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl:
        process.env.NODE_ENV !== 'development' &&
        process.env.NODE_ENV !== 'test'
          ? { rejectUnauthorized: false }
          : false,
      entities: dbconfig.entities,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    };
  }

  public static forRoot(dbconfig: any): DynamicModule {
    return {
      module: DBModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configservice: ConfigService) =>
            DBModule.getConnectionOptions(configservice, dbconfig),
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
