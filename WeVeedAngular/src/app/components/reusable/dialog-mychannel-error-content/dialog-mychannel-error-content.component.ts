import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-dialog-mychannel-error-content',
  templateUrl: './dialog-mychannel-error-content.component.html',
  styleUrls: ['./dialog-mychannel-error-content.component.css']
})
export class DialogMychannelErrorContentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogMychannelErrorContentComponent>, private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: string[]) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
    this.utilsService.navigateInSlider('/search');
  }

}
