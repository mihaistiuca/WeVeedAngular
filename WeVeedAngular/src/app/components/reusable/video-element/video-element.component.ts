import { Component, OnInit, Input } from '@angular/core';
import { ElementInfo } from '../images-slider/SliderInfo';
import { Router } from '@angular/router';
import { UtilsService } from '../../../services/utils/utils.service';
import { DataService } from '../../../services/data/data.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-video-element',
  templateUrl: './video-element.component.html',
  styleUrls: ['./video-element.component.css']
})
export class VideoElementComponent implements OnInit {

  @Input() video: ElementInfo;
  
  constructor(private router: Router, private utilsService: UtilsService, private notificationService: NotificationService, private dataService: DataService) { }

  ngOnInit() {
  }

  public navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  public navigateInPlayerTo(playable: string): void {
    this.utilsService.navigateInPlayer(playable);
  }

  public navigateSingleInPlayerTo(playable: string): void {
    if (!this.video.wasEncoded) {
      this.notificationService.info('Acest video este in curs de procesare. In cateva minute va fi disponibil.', 12000);
      return;
    }

    if (this.video.videoBelongsToCurrentUser) {
      return;
    }

    if (this.video.videoCategory) {
      // the video element is inside the channels tab

      this.dataService.changeVideoIdThatWillPlayInChannel(playable);
      this.dataService.changeChannelVideoIdPlayNow(playable);
      this.dataService.changeChannelVideoPlayingNowDiffItem(this.video.videoCategory);
      this.router.navigateByUrl('/' + this.video.videoCategory + '/playnow');
      this.dataService.changeChannelVideoIdForNextVideoPlay(playable);
    }
    else {
      this.router.navigateByUrl(playable);
      this.utilsService.navigateInPlayer(playable);
    }
  }

  // public navigateInPlayerTo(channelName: string): void {
  //   if (this.currentChannelName == channelName) {
  //     let channelConfigObj = this.constants.ChannelsConfig.filter(a=>a.name == channelName)[0];
  //     this.notificationService.info('Canalul ' + channelConfigObj.roName.charAt(0).toUpperCase() + channelConfigObj.roName.slice(1) + ' este deja deschis in partea stanga.');
  //     return;
  //   }

  //   // this.utilsService.navigateInPlayer(channelName);
  //   // let privateSelf = this;
  //   // setTimeout(() => {
  //     // privateSelf.router.navigateByUrl('/' + channelName + '/playnow');
  //   // }, 200);
  //   this.dataService.changeWaitForThisChannelEventInPlayNow(channelName);
  //   setTimeout(() => {
  //     this.router.navigateByUrl('/' + channelName + '/playnow');  
  //   }, 20);
    
  //   // this.utilsService.navigateInSlider('/playnow');
  // }

  public navigateInSlider(url: string): void {
    this.utilsService.navigateInSlider(url);
  }

}
