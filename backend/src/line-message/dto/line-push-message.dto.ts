import { IsNotEmpty } from 'class-validator';
import { LineMessageDto } from './line-message.dto';

export class LinePushMessageDto {

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  messages: LineMessageDto[];

}
