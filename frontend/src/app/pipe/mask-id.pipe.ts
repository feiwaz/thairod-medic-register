import { Pipe, PipeTransform } from '@angular/core';
import { maskId } from '../util/util-functions';

@Pipe({
  name: 'maskId'
})
export class MaskIdPipe implements PipeTransform {

  transform(nationalId: string | number): string {
    return maskId(nationalId) || '';
  }

}
