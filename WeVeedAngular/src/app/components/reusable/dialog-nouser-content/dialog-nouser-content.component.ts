import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-dialog-nouser-content',
  templateUrl: './dialog-nouser-content.component.html',
  styleUrls: ['./dialog-nouser-content.component.css']
})
export class DialogNouserContentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogNouserContentComponent>, private utilsService: UtilsService) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close();
    this.utilsService.navigateInSlider('/account');
  }

}
