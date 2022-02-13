import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-slider-error',
  templateUrl: './slider-error.component.html',
  styleUrls: ['./slider-error.component.css']
})
export class SliderErrorComponent implements OnInit {

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
  }

  public goToMain(): void {
    this.utilsService.navigateToMain();
  }

}
