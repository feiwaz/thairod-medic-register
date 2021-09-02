import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LineMessageService } from './line-message.service';

@Module({
  imports: [HttpModule],
  providers: [LineMessageService],
  exports: [LineMessageService],
})
export class LineMessageModule { }