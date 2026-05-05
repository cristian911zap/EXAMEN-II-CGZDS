import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [OptionsService],
  controllers: [OptionsController],
  exports: [OptionsService],
})
export class OptionsModule {}