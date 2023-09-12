import { Module } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { TheaterController } from './theater.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from './theater.entity/theater.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Theater]),
  ],
  providers: [TheaterService],
  controllers: [TheaterController]
})
export class TheaterModule { }
