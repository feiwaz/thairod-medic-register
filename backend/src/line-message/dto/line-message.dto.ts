import { IsNotEmpty } from 'class-validator';

export class LineMessageDto {

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  text: string;

}
