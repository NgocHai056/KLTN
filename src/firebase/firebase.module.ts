import { Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService],
  controllers: [FirebaseController],
  exports: [FirebaseService]
})
export class FirebaseModule { }
