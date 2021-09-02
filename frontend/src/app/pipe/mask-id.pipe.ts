import { Pipe, PipeTransform } from '@angular/core';
import { maskId } from '../util/util-functions';

@Pipe({
  name: 'maskId'
})
export class MaskIdPipe implements PipeTransform {

  transform(nationalId: string): string {
    return maskId(nationalId) || '';
  }

}
