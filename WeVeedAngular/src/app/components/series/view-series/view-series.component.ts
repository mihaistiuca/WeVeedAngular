import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data/data.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { SeriesService } from '../../../services/series/series.service';
import { SeriesViewDto } from '../../../generated-models/SeriesViewDto';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { NotificationService } from '../../../services/notification/notification.service';
import { VideoService } from '../../../services/video/video.service';
import { VideoDisplayCarouselDto } from '../../../generated-models/VideoDisplayCarouselDto';
import { ElementInfo, SliderInfo } from '../../reusable/images-slider/SliderInfo';
import { VideoDisplayUiDto } from '../../../generated-models/VideoDisplayUiDto';
import { PaginatorInfo } from '../../reusable/video-paginator/PaginatorInfo';
import { AllVideoPaginateInput } from '../../../generated-models/AllVideoPaginateInput';
import { AuthService } from '../../../services/auth/auth.service';
import { UserBasicInfoDto } from '../../../generated-models/UserBasicInfoDto';
import { SeriesFollowInput } from '../../../generated-models/SeriesFollowInput';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/Constants';
import { VideoPlayingNowDto } from '../../../generated-models/VideoPlayingNowDto';

@Component({
  selector: 'app-view-series',
  templateUrl: './view-series.component.html',
  styleUrls: ['./view-series.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('200ms', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        style({transform: 'translateX(0)', opacity: 1}),
        animate('200ms', style({transform: 'translateX(-100%)', opacity: 0}))
      ])
    ])
  ]
})
export class ViewSeriesComponent implements OnInit, OnDestroy {

  @ViewChild('seriesDescription') seriesDescription: ElementRef;
  public isShowMoreDescriptionButtonVisible: boolean = false;
  public isShowLessDescriptionButtonVisible: boolean = false;
  public descriptionHasTheClass: boolean = true;
  public descScrollableHeight: string;

  public seriesId: string;
  public isSeriesLoading: boolean = true;
  public series: SeriesViewDto;

  public isSliderMostViewedVideoLoading: boolean = true;
  public sliderMostViewedVideo: SliderInfo;

  public videoPaginatorInfo: PaginatorInfo;
  public moreVideosAreLoading: boolean = true;
  public allVideosScrollPage: number = 1;
  public areThereAnyMoreVideos: boolean = true;
  public hasFirstVideoRoundInitFinished: boolean = false;

  public isFollowRequestLoading: boolean;
  public isUnFollowRequestLoading: boolean;
  public currentUserId: string;
  public currentUserInfo: UserBasicInfoDto;
  public currentUserFollowedSeries: string[];
  public currentUserFollowsThisSeries: boolean;

  public currentUserBasicInfoSubscription: Subscription;
  public scrollToBottomDistanceSubscription: Subscription;

  constructor(private router: ActivatedRoute, private dataService: DataService, private utilsService: UtilsService, private navRouter: Router, private constants: Constants,
    private seriesService: SeriesService, private notificationService: NotificationService, private videoService: VideoService, private authService: AuthService) { }

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();
    
    this.router.params.subscribe(params => {
      this.seriesId = params['id'];
      if (!this.seriesId) {
        this.utilsService.navigateToSliderNotFound();
        return;
      }

      this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
        if(value == null) {
          return;
        }
        
        this.currentUserInfo = value;
        this.currentUserFollowedSeries = value.seriesFollowed;
        this.currentUserFollowsThisSeries = value.seriesFollowed.includes(this.seriesId);
      });
      
      this.initSeries();

      this.scrollToBottomDistanceSubscription = this.dataService.scrollToBottomDistance.subscribe((value: number) => {
        if (value < 400 && this.areThereAnyMoreVideos && this.hasFirstVideoRoundInitFinished) {
          this.utilsService.debounce(this.getMoreVideos, 200, false, this);
        }
      });
    });
  }

  ngOnDestroy() {
    this.currentUserBasicInfoSubscription.unsubscribe();
    this.scrollToBottomDistanceSubscription.unsubscribe();
  }

  public addEpisodeInSeries(): void {
    this.utilsService.navigateInSlider('/account/add-video/' + this.seriesId);
  }

  public initSeries(): void {
    this.seriesService.getViewById(this.seriesId)
    .subscribe(
      (response: BaseResponse<SeriesViewDto>) => {
        if (response.status == 500 || response.status == 404) {
          this.utilsService.navigateToSliderError();
        }
        else if (response.status == 200) {
          if (!response.data) {
            this.utilsService.navigateToSliderNotFound();
          }

          this.isSeriesLoading = false;
          this.series = response.data;
          this.series.category = this.constants.channelNamingMapping[this.series.category];

          var self = this;
          setTimeout(() => {
            self.isShowMoreDescriptionButtonVisible = self.seriesDescription.nativeElement.scrollHeight != self.seriesDescription.nativeElement.offsetHeight;
            self.descriptionHasTheClass = self.isShowMoreDescriptionButtonVisible;
            if (!self.descriptionHasTheClass) {
              self.descScrollableHeight = self.seriesDescription.nativeElement.scrollHeight + 'px';
            }
          }, 200);

          this.initMostViewedVideoSlider();

          this.videoPaginatorInfo = { halfCardElements: [] } as PaginatorInfo;
          this.initAllVideos();
        }
        else {
          this.utilsService.navigateToSliderError();
        }
      },
      error => {
        this.utilsService.navigateToSliderError();
      }
    );
  }

  public initMostViewedVideoSlider(): void {
    this.videoService.getMostViewedBySeries(this.seriesId)
      .subscribe(
        (response: BaseResponse<VideoDisplayCarouselDto[]>) => {
          if (response.status == 500) {
            this.notificationService.fail('Incarcarea video-urilor populare nu a reusit');
            this.isSliderMostViewedVideoLoading = false;
          }
          else if (response.status == 200) {
            let dataElements: ElementInfo[] = [];
            if (response.data) {
              dataElements = response.data.map(a=> ({
                id: a.id,
                name: a.title,
                description: null,
                imgSrc: a.thumbnailUrl,
                redirectUrl: '',

                season: a.season,
                episode: a.episode,
                parentSeriesName: a.seriesName,
                parentSeriesThumbnailUrl: a.seriesThumbnail,
                videoProducerId: a.userProducerId,
                videoBelongsToCurrentUser: a.userProducerId == this.currentUserId,
                updateVideoPageUrl: '/account/update-video/' + a.id,
                deleteVideoPageUrl: '/account/delete-video/' + a.id,

                numberOfViews: a.numberOfViews,
                length: a.length,
                wasEncoded: a.encodedVideoKey != null
              } as ElementInfo));
            }

            this.sliderMostViewedVideo = {
              isSeries: false,
              isVideo: true,
              elements: dataElements
            };
            this.isSliderMostViewedVideoLoading = false;
          }
          else  {
            this.notificationService.fail('Incarcarea video-urilor populare nu a reusit');
            this.isSliderMostViewedVideoLoading = false;
          }
        },
        error => {
          this.notificationService.fail('Incarcarea video-urilor populare nu a reusit');
          this.isSliderMostViewedVideoLoading = false;
        }
      );
  }

  public initAllVideos(): void {
    let input: AllVideoPaginateInput = {
      page: 1,
      pageSize: 10
    };

    this.videoService.getAllSeriesPaginated(this.seriesId, input)
      .subscribe(
        (response: BaseResponse<VideoDisplayUiDto[]>) => {
          if (response.status == 500) {
            this.notificationService.fail('Incarcarea video-urilor nu a reusit');
            this.moreVideosAreLoading = false;
          }
          else if (response.status == 200) {
            let videoHalfCards: VideoDisplayUiDto[] = [];

            if (response.data && response.data.length) {
              videoHalfCards = response.data;
            }

            this.videoPaginatorInfo = {
              halfCardElements: videoHalfCards
            } as PaginatorInfo;
            this.moreVideosAreLoading = false;

            if (videoHalfCards.length < 10) {
              this.areThereAnyMoreVideos = false;
            }

            this.hasFirstVideoRoundInitFinished = true;
          }
          else  {
            this.notificationService.fail('Incarcarea video-urilor nu a reusit');
            this.moreVideosAreLoading = false;
          }
        },
        error => {
          this.notificationService.fail('Incarcarea video-urilor nu a reusit');
          this.moreVideosAreLoading = false;
        }
      );
  }

  public getMoreVideos(self): void {
    self.moreVideosAreLoading = true;
    self.allVideosScrollPage++;
    let input: AllVideoPaginateInput = {
      page: self.allVideosScrollPage,
      pageSize: 10
    };

    self.videoService.getAllSeriesPaginated(self.seriesId, input)
      .subscribe(
        (response: BaseResponse<VideoDisplayUiDto[]>) => {
          if (response.status == 500) {
            self.notificationService.fail('Incarcarea video-urilor nu a reusit');
            self.moreVideosAreLoading = false;
          }
          else if (response.status == 200) {
            // this.videoPaginatorInfo.elements = this.videoPaginatorInfo.elements.concat(response.data);

            let videoHalfCards: VideoDisplayUiDto[] = [];

            if (response.data && response.data.length) {
              videoHalfCards = response.data;
            }

            self.videoPaginatorInfo.halfCardElements = self.videoPaginatorInfo.halfCardElements.concat(videoHalfCards);
            self.moreVideosAreLoading = false;

            if (videoHalfCards.length < 10) {
              self.areThereAnyMoreVideos = false;
            }
          }
          else  {
            self.notificationService.fail('Incarcarea video-urilor nu a reusit');
            self.moreVideosAreLoading = false;
          }
        },
        error => {
          self.notificationService.fail('Incarcarea video-urilor nu a reusit');
          self.moreVideosAreLoading = false;
        }
      );
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

  // search for this later when you need it 
  public gotoo() {
    this.navRouter.navigate(['good', 'series', '5be9df995be1f31c40a91772']);
  }

  public goToUpdateSeries(): void {
    this.utilsService.navigateInSlider('/account/update-series/' + this.seriesId);
  }

  public goToDeleteSeries(): void {
    this.utilsService.navigateInSlider('/account/delete-series/' + this.seriesId);
  }

  public goToProducer(): void {
    this.utilsService.navigateInSlider('/producer/' + this.series.producerId);
  }

  public followTheSeries(): void {
    if (!this.currentUserInfo) {
      this.notificationService.fail('Trebuie sa fii conectat pentru a putea urmari o emisiune.');
      return;
    }

    this.isFollowRequestLoading = true;

    let input: SeriesFollowInput = {
      seriesId: this.seriesId
    };

    this.seriesService.follow(input)
      .subscribe(
        (response: BaseResponse) => {
          if (response.status == 200) {
            this.currentUserFollowedSeries.push(this.seriesId);
            this.currentUserInfo.seriesFollowed = this.currentUserFollowedSeries;
            this.dataService.changeUserBasicInfo(this.currentUserInfo);
            
            this.series.followersCount++;

            this.isFollowRequestLoading = false;

            this.notificationService.success('Urmaresti cu succes emisiunea ' + this.series.name+ '.');
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
      seriesId: this.seriesId
    };

    this.seriesService.unfollow(input)
      .subscribe(
        (response: BaseResponse) => {
          if (response.status == 200) {
            let index: number = this.currentUserFollowedSeries.indexOf(this.seriesId);
            if (index > -1) {
              this.currentUserFollowedSeries.splice(index, 1);
            }

            this.currentUserInfo.seriesFollowed = this.currentUserFollowedSeries;
            this.dataService.changeUserBasicInfo(this.currentUserInfo);
            
            this.series.followersCount--;

            this.isUnFollowRequestLoading = false;

            this.notificationService.info('Emisiunea ' + this.series.name + ' nu mai este in topul preferintelor tale.');
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
