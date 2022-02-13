import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-notification-content',
  templateUrl: './notification-content.component.html',
  styleUrls: ['./notification-content.component.css']
})
export class NotificationContentComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private snackRef: MatSnackBarRef<NotificationContentComponent>) { }

  ngOnInit() {
  }

  public closeNotification(): void {
    this.snackRef.dismiss();
  }

}
