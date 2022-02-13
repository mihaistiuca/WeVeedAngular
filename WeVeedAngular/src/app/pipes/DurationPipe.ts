import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'wvdduration'})
export class DurationPipe implements PipeTransform {

  transform(value: number): string {

    const minutes: number = Math.floor(value / 60);
    const seconds = value - minutes * 60

    if (seconds < 10) {
        return minutes + ':0' + seconds;
    }

    return minutes + ':' + seconds;
  }
}