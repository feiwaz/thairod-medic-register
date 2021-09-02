import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'thaiDatetime'
})
export class ThaiDatetimePipe implements PipeTransform {

  transform(dateTime: string, format: string): string {
    let result = '';
    if (dateTime) {
      const aMoment = moment(dateTime).locale('th').tz('Asia/Bangkok');
      const adYear = aMoment.year();
      const beYear = (adYear + 543).toString();
      result = aMoment.format(format).replace(adYear.toString(), beYear);
    }
    return result;
  }

}
