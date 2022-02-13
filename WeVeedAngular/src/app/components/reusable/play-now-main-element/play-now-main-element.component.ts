import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { VideoPlayingNowDto } from '../../../generated-models/VideoPlayingNowDto';
import { UtilsService } from '../../../services/utils/utils.service';
import { DataService } from '../../../services/data/data.service';
import { Subscription } from 'rxjs';
import { UserBasicInfoDto } from 'src/app/generated-models/UserBasicInfoDto';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SeriesFollowInput } from 'src/app/generated-models/SeriesFollowInput';
import { SeriesService } from 'src/app/services/series/series.service';
import { BaseResponse } from 'src/app/basic-models/BaseResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-now-main-element',
  templateUrl: './play-now-main-element.component.html',
  styleUrls: ['./play-now-main-element.component.css']
})
export class PlayNowMainElementComponent implements OnInit, OnDestroy {

  @Input() MainElementInfo: VideoPlayingNowDto;
  @Input() IsNextElement: boolean;
  @Input() InsideChannelProgram: string;

  @Input() IsSingleVideoPlaying: boolean;

  @Input() IsFromComments: boolean;

  @ViewChild('videoDescription') seriesDescription: ElementRef;
  public isShowMoreDescriptionButtonVisible: boolean = false;
  public isShowLessDescriptionButtonVisible: boolean = false;
  public descriptionHasTheClass: boolean = true;
  public descScrollableHeight: string;

  public currentUserFollowsThisSeries: boolean;
  public currentUserBasicInfoSubscription: Subscription;
  public currentUserInfo: UserBasicInfoDto;
  public currentUserFollowedSeries: string[];

  public isFollowRequestLoading: boolean;
  public isUnFollowRequestLoading: boolean;

  constructor(private utilsService: UtilsService, private dataService: DataService, private notificationService: NotificationService, private seriesService: SeriesService,
    private router: Router) { }

  ngOnDestroy() {
    this.currentUserBasicInfoSubscription.unsubscribe();
  }

  ngOnInit() {
      this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
        if(value == null) {
          return;
        }
        
        this.currentUserInfo = value;
        this.currentUserFollowedSeries = value.seriesFollowed;
        this.currentUserFollowsThisSeries = value.seriesFollowed.includes(this.MainElementInfo.seriesId);
      });

      var self = this;
      setTimeout(() => {
        if (self && self.seriesDescription) {
          self.isShowMoreDescriptionButtonVisible = self.seriesDescription.nativeElement.scrollHeight != self.seriesDescription.nativeElement.offsetHeight;
            self.descriptionHasTheClass = self.isShowMoreDescriptionButtonVisible;
            if (!self.descriptionHasTheClass) {
              self.descScrollableHeight = self.seriesDescription.nativeElement.scrollHeight + 'px';
            }
        }

        if (self.IsSingleVideoPlaying) {
          self.showMoreDescription();
        }
      }, 200);
  }

  public showMoreDescription(): void {
    this.isShowMoreDescriptionButtonVisible = false;
    this.isShowLessDescriptionButtonVisible = true;
    this.descriptionHasTheClass = false;
    
    this.descScrollableHeight = this.seriesDescription.nativeElement.scrollHeight + 'px';
  }

  public showLessDescription(): void {
    this.isShowMoreDescriptionButtonVisible = true;
    this.isShowLessDescriptionButtonVisible = false;
    this.descriptionHasTheClass = true;
    
    this.descScrollableHeight = null;
  }

  public clickOnDescription(): void {
    if (this.descriptionHasTheClass) {
      this.showMoreDescription();
    }
  }

  public goToProducer(producerId: string): void {
    this.utilsService.navigateInSlider('/producer/' + producerId);
  }

  public goToSeries(seriesId: string): void {
    this.utilsService.navigateInSlider('/series/' + seriesId);
  }

  public playVideo(videoId: string): void {
    if (!this.IsNextElement) {
      return;
    }

    if (this.InsideChannelProgram) {
      // this is a play from inside the channel's program page 

      this.dataService.changeVideoIdThatWillPlayInChannel(videoId);
      this.dataService.changeChannelVideoIdPlayNow(videoId);
      this.dataService.changeChannelVideoPlayingNowDiffItem(this.InsideChannelProgram);
      this.router.navigateByUrl('/' + this.InsideChannelProgram + '/playnow');
      this.dataService.changeChannelVideoIdForNextVideoPlay(videoId);
    }
    else {
      this.dataService.changeChannelVideoIdForNextVideoPlay(videoId);
    }
  }

  public followTheSeries(): void {
    if (!this.currentUserInfo) {
      this.notificationService.fail('Trebuie sa fii conectat pentru a putea urmari o emisiune.');
      return;
    }

    this.isFollowRequestLoading = true;

    let input: SeriesFollowInput = {
      seriesId: this.MainElementInfo.seriesId
    };

    this.seriesService.follow(input)
      .subscribe(
        (response: BaseResponse) => {
          if (response.status == 200) {
            this.currentUserFollowedSeries.push(this.MainElementInfo.seriesId);
            this.currentUserInfo.seriesFollowed = this.currentUserFollowedSeries;
            this.dataService.changeUserBasicInfo(this.currentUserInfo);
            
            this.isFollowRequestLoading = false;

            this.notificationService.success('Urmaresti cu succes emisiunea ' + this.MainElementInfo.seriesName + '.');
          }
          else  {
            this.notificationService.fail('Ceva nu a mers bine.');
            this.isFollowRequestLoading = false;
          }
        },
        error => {
            this.notificationService.fail('Ceva nu a mers bine.');
            this.isFollowRequestLoading = false;
        }
      );
  }

  public unfollowTheSeries(): void {
    this.isUnFollowRequestLoading = true;

    let input: SeriesFollowInput = {
      seriesId: this.MainElementInfo.seriesId
    };

    this.seriesService.unfollow(input)
      .subscribe(
        (response: BaseResponse) => {
          if (response.status == 200) {
            let index: number = this.currentUserFollowedSeries.indexOf(this.MainElementInfo.seriesId);
            if (index > -1) {
              this.currentUserFollowedSeries.splice(index, 1);
            }

            this.currentUserInfo.seriesFollowed = this.currentUserFollowedSeries;
            this.dataService.changeUserBasicInfo(this.currentUserInfo);
            
            this.isUnFollowRequestLoading = false;

            this.notificationService.info('Emisiunea ' + this.MainElementInfo.seriesName + ' nu mai este in topul preferintelor tale.');
          }
          else  {
            this.notificationService.fail('Ceva nu a mers bine.');
            this.isUnFollowRequestLoading = false;
          }
        },
        error => {
            this.notificationService.fail('Ceva nu a mers bine.');
            this.isUnFollowRequestLoading = false;
        }
      );
  }

}
