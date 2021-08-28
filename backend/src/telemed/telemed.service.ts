import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
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

  public async submitData(body: any, role: 'doctors' | 'volunteers'): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${await this.getToken()}`, 'Content-Type': 'application/json' }
    };
    const url = role === 'doctors' ? process.env.TELEMED_ENDPOINT_SUBMIT_DOCTOR : process.env.TELEMED_ENDPOINT_SUBMIT_VOLUNTEER;
    return await lastValueFrom(this.httpService.post(url, body, config));
  }

}