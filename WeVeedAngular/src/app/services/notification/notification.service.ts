import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationContentComponent } from '../../components/reusable/notification-content/notification-content.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  public success(message: string, duration: number = null): void {

    if(duration == null) {
      duration = 4000;
    }

    this.snackBar.openFromComponent(NotificationContentComponent, {
      data: { text: message, type: 'success' },
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  public fail(message: string, duration: number = null): void {

    if(duration == null) {
      duration = 4000;
    }

    this.snackBar.openFromComponent(NotificationContentComponent, {
      data: { text: message, type: 'fail' },
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  public info(message: string, duration: number = null): void {

    if(duration == null) {
      duration = 4000;
    }

    this.snackBar.openFromComponent(NotificationContentComponent, {
      data: { text: message, type: 'info' },
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
