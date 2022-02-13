import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-slider-not-found',
  templateUrl: './slider-not-found.component.html',
  styleUrls: ['./slider-not-found.component.css']
})
export class SliderNotFoundComponent implements OnInit {

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
  }

  public goToMain(): void {
    this.utilsService.navigateToMain();
  }

}
