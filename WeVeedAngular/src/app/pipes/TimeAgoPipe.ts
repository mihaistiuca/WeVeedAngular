import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'wvdtimeago'})
export class TimeAgo implements PipeTransform {

  transform(value: Date): string {

    if (value == null) {
        return null;
    }

    let dt = new Date(value);
    let dtAny = dt as any;
    let seconds = Math.floor((Date.now() - dtAny) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return "acum " + interval + " ani";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return "acum " + interval + " luni";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return "acum " + interval + " zile";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return "acum " + interval + " ore";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return "acum " + interval + " minute";
    }
    return "chiar acum";
  }
}