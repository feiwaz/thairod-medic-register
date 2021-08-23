import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TelemedService } from './telemed.service';

@Module({
  imports: [HttpModule],
  providers: [TelemedService],
  exports: [TelemedService],
})
export class TelemedModule { }