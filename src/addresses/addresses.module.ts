import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { addressProviders } from './adress.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AddressesController],
  imports: [DatabaseModule],
  providers: [...addressProviders, AddressesService],
  exports: [...addressProviders, AddressesService],
})
export class AddressesModule {}
