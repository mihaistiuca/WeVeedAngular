import { Component, OnInit, Input } from '@angular/core';
import { ProdSliderInfo } from './ProdSliderInfo';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  selector: 'app-producer-slider',
  templateUrl: './producer-slider.component.html',
  styleUrls: ['./producer-slider.component.css']
})
export class ProducerSliderComponent implements OnInit {

  @Input() sliderInfo: ProdSliderInfo;

  public elementsCount: number;

  public currentPosition: number = 0;
  public currentIndex: number = 0;
  public isAtBeginning: boolean = true;
  public shouldDisplayRightArrow : boolean = false;
  public shouldDisplayLeftArrow : boolean = false;
  public reachedEnd: boolean = false;

  constructor(public domSanitizer: DomSanitizer, private router: Router, private utilsService: UtilsService) { }

  ngOnInit() {
    this.elementsCount = this.sliderInfo.elements == null ? 0 : this.sliderInfo.elements.length;
    this.shouldDisplayRightArrow = this.elementsCount >= 5;
    this.shouldDisplayLeftArrow = this.elementsCount >= 5;
  }

  public myTransformValue(): SafeStyle {
    var translateValString = 'translate3d(' + this.currentPosition + '%, 0px, 0px)'
    return this.domSanitizer.bypassSecurityTrustStyle(translateValString);
  }

  public moveRight(): void {
    if (this.reachedEnd) {
      return;
    }

    if(this.isAtBeginning) {
      if (this.elementsCount < 5) {
        return;
      }
      else if (this.elementsCount == 5) {
        this.currentPosition = -25;
        this.reachedEnd = true;
        this.isAtBeginning = false;
        this.currentIndex = 1;
        return;
      }
      else if (this.elementsCount == 6) {
        this.currentPosition = -50;
        this.reachedEnd = true;
        this.isAtBeginning = false;
        this.currentIndex = 2;
        return;
      }
      else if (this.elementsCount == 7) {
        this.currentPosition = -75;
        this.reachedEnd = true;
        this.isAtBeginning = false;
        this.currentIndex = 3;
        return;
      }
      else if (this.elementsCount == 8) {
        this.currentPosition = -100;
        this.reachedEnd = true;
        this.isAtBeginning = false;
        this.currentIndex = 4;
        return;
      }
      else if (this.elementsCount > 8) {
        this.currentPosition = -100;
        this.reachedEnd = false;
        this.isAtBeginning = false;
        this.currentIndex = 4;
        return;
      }
    }
    else {
      let elementsUntilEnd = this.getElementsUntilEnd();
      if (elementsUntilEnd == 0) {
        this.reachedEnd = true;
        return;
      }
      else if (elementsUntilEnd == 1) {
        this.reachedEnd = true;
        this.currentIndex = this.currentIndex + 1;
        this.currentPosition = this.currentPosition - 25;
        return;
      }
      else if (elementsUntilEnd == 2) {
        this.reachedEnd = true;
        this.currentIndex = this.currentIndex + 2;
        this.currentPosition = this.currentPosition - 50;
        return;
      }
      else if (elementsUntilEnd == 3) {
        this.reachedEnd = true;
        this.currentIndex = this.currentIndex + 3;
        this.currentPosition = this.currentPosition - 75;
        return;
      }
      else if (elementsUntilEnd == 4) {
        this.reachedEnd = true;
        this.currentIndex = this.currentIndex + 4;
        this.currentPosition = this.currentPosition - 100;
        return;
      }
      else if (elementsUntilEnd > 4) {
        this.reachedEnd = false;
        this.currentIndex = this.currentIndex + 4;
        this.currentPosition = this.currentPosition - 100;
        return;
      }
    }
  }

  public moveLeft(): void {
    if (this.isAtBeginning) {
      return;
    }

    if (this.reachedEnd) {
      if (this.elementsCount == 5) {
        this.reachedEnd = false;
        this.isAtBeginning = true;
        this.currentIndex = 0;
        this.currentPosition = 0;
        return;
      }
      else if (this.elementsCount == 6) {
        this.reachedEnd = false;
        this.isAtBeginning = true;
        this.currentIndex = 0;
        this.currentPosition = 0;
        return;
      }
      else if (this.elementsCount == 7) {
        this.reachedEnd = false;
        this.isAtBeginning = true;
        this.currentIndex = 0;
        this.currentPosition = 0;
        return;
      }
      else if (this.elementsCount == 8) {
        this.reachedEnd = false;
        this.isAtBeginning = true;
        this.currentIndex = 0;
        this.currentPosition = 0;
        return;
      }
      else if (this.elementsCount > 8) {
        this.currentPosition = this.currentPosition + 100;
        this.currentIndex = this.elementsCount - 8; // ??????????????
        this.reachedEnd = false;
        this.isAtBeginning = false;
        return;
      }
    }
    else {
      let elementsUntilBeginning = this.getElementsUntilBeginning();
      if (elementsUntilBeginning == 0) {
        this.isAtBeginning = true;
        return;
      }
      else if (elementsUntilBeginning == 1 || elementsUntilBeginning == 2 || elementsUntilBeginning == 3 || elementsUntilBeginning == 4) {
        this.isAtBeginning = true;
        this.currentPosition = 0;
        this.currentIndex = 0;
        return;
      }
      else if (elementsUntilBeginning >= 5) {
        this.isAtBeginning = false;
        this.reachedEnd = false;
        this.currentPosition = this.currentPosition + 100;
        this.currentIndex = this.currentIndex - 4;
      }
    }
  }

  private getElementsUntilEnd(): number {
    var elementsUntilEnd = this.elementsCount - this.currentIndex - 4;
    if (elementsUntilEnd < 0) {
      return 0;
    }
    return elementsUntilEnd;
  }

  private getElementsUntilBeginning(): number {
    return this.currentIndex;
  }

  public redirectTo(url: string): void {
    this.utilsService.navigateInSlider(url);
  }

}
