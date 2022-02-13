import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public showLogo: boolean = false;

  public showLogoSubscription: Subscription;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.showLogoSubscription = this.dataService.showLogo.subscribe((value: boolean) => {
      this.showLogo = value;
    });
  }

  ngOnDestroy() {
    this.showLogoSubscription.unsubscribe();
  }

}
