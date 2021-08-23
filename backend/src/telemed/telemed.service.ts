import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { lastValueFrom, map } from "rxjs";

@Injectable()
export class TelemedService {

  constructor(private httpService: HttpService) { }

  private async getToken(): Promise<any> {
    const body = {
      clientId: process.env.TELEMED_CLIENT_ID,
      clientSecret: process.env.TELEMED_CLIENT_SECRET
    };
    const config: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
    return await lastValueFrom(this.httpService.post(process.env.TELEMED_ENDPOINT_TOKEN, body, config)
      .pipe(map(response => response?.data?.items?.Token)));
  }

  public async submitData(body: any): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${await this.getToken()}`, 'Content-Type': 'application/json' }
    };
    return await lastValueFrom(this.httpService.post(process.env.TELEMED_ENDPOINT_SUBMIT, body, config));
  }

}