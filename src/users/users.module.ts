import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsDocAlreadyInUseConstraint } from './validations/users.doc-constraint';
import { IsWhatsappAlreadyInUseConstraint } from './validations/users.whatsapp-constraint';

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule],
  providers: [
    ...userProviders,
    UsersService,
    IsDocAlreadyInUseConstraint,
    IsWhatsappAlreadyInUseConstraint,
  ],
  exports: [...userProviders, UsersService],
})
export class UsersModule {}
