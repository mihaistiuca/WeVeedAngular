import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('visible',
        style({
          opacity: 1,
          transform: 'translateX(0)'
        })),
      state('invisible',
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        })),

      transition('visible => invisible', [
        animate('500ms ease-in', style({transform: 'translateX(100%)', opacity: 0}))
      ]),
      transition('invisible => visible', [
        animate('500ms ease-in', style({transform: 'translateX(0)', opacity: 1}))
      ]),
    ])
  ]
  
})
export class MainComponent implements OnInit, OnDestroy {
  
  @ViewChild('videoPlayer') videoPlayer: any;
  public videoSrc: string;
  
  public isMenuCollapsed: boolean;

  public currentIsVideoLargeScreenSubscription: Subscription;

  public elementState = 'visible';

  constructor(private dataService: DataService, private router: ActivatedRoute) { 
    this.videoSrc = 'http://techslides.com/demos/sample-videos/small.mp4#t=10';

    this.router.params.subscribe(params => {
      this.dataService.changePlayingNowItem(params['playing']);
    });
  }

  ngOnInit() {
    this.currentIsVideoLargeScreenSubscription = this.dataService.currentIsVideoLargeScreen.subscribe((value: boolean) => {
      this.isMenuCollapsed = value;
      if (value) {
        this.elementState = 'invisible';
      }
      else {
        this.elementState = 'visible';
      }
    });
  }

  ngOnDestroy() {
    this.currentIsVideoLargeScreenSubscription.unsubscribe();
  }

}
