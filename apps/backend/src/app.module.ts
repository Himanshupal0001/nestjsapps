import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './config/db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DBModule.forRoot({
      entities: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
