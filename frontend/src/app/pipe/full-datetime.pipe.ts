import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Pipe({
  name: 'fullDatetime'
})
export class FullDatetimePipe implements PipeTransform {

  transform(dateTime: string): string {
    return moment(dateTime).locale('th').add(543, 'year').format('LLLL น.');
  }

}
