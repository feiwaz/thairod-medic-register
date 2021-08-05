import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseFormDataRequestPipe implements PipeTransform<{ body: string }, any> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(formDataReq: { body: string }, metadata: ArgumentMetadata): any {
    if (!('body' in formDataReq)) {
      throw new BadRequestException("form-data key must be 'body'");
    }

    let bodyObject = {};
    try {
      bodyObject = JSON.parse(formDataReq.body);
    } catch {
      throw new BadRequestException('form-data value is not a valid JSON');
    }
    return bodyObject;
  }
}