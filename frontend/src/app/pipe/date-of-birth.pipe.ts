import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateOfBirth'
})
export class DateOfBirthPipe implements PipeTransform {

  transform(dateTime: string): string {
    return moment(dateTime).locale('th').format('DD MMM YYYY');
  }

}
