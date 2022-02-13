import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-dialog-producer-conditions',
  templateUrl: './dialog-producer-conditions.component.html',
  styleUrls: ['./dialog-producer-conditions.component.css']
})
export class DialogProducerConditionsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogProducerConditionsComponent>, private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: string[]) { }

  ngOnInit() {
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

}
