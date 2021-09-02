import { HttpService } from "@nestjs/axios";
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { LinePushMessageDto } from './dto/line-push-message.dto';

@Injectable()
export class LineMessageService {

  constructor(private httpService: HttpService) { }

  public async sendPushMessage(body: LinePushMessageDto): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`, 'Content-Type': 'application/json' }
    };
    return await lastValueFrom(this.httpService.post(process.env.LINE_MESSAGE_ENDPOINT, body, config));
  }

}