import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
