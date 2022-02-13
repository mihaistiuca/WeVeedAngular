import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification/notification.service';
import { DataService } from '../../../services/data/data.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { AuthService } from '../../../services/auth/auth.service';
import { VideoService } from '../../../services/video/video.service';
import { SeriesService } from '../../../services/series/series.service';
import { ProducerViewDto } from '../../../generated-models/ProducerViewDto';
import { SliderInfo, ElementInfo } from '../../reusable/images-slider/SliderInfo';
import { PaginatorInfo } from '../../reusable/video-paginator/PaginatorInfo';
import { UserService } from '../../../services/user/user.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { ProducerSeriesDto } from '../../../generated-models/ProducerSeriesDto';
import { VideoDisplayCarouselDto } from '../../../generated-models/VideoDisplayCarouselDto';
import { AllVideoPaginateInput } from '../../../generated-models/AllVideoPaginateInput';
import { VideoDisplayUiDto } from '../../../generated-models/VideoDisplayUiDto';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/Constants';
import { VideoPlayingNowDto } from '../../../generated-models/VideoPlayingNowDto';

@Component({
  selector: 'app-view-producer',
  templateUrl: './view-producer.component.html',
  styleUrls: ['./view-producer.component.css']
})
export class ViewProducerComponent implements OnInit, OnDestroy {

  @ViewChild('producerDescription') producerDescription: ElementRef;
  public isShowMoreDescriptionButtonVisible: boolean = false;
  public isShowLessDescriptionButtonVisible: boolean = false;
  public descriptionHasTheClass: boolean = true;
  public descScrollableHeight: string;

  public producerId: string;
  public isproducerLoading: boolean = true;
  public producer: ProducerViewDto;

  public sliderInfoSeries: SliderInfo;
  public isSeriesSliderLoading: boolean = true;

  public isSliderMostViewedVideoLoading: boolean = true;
  public sliderMostViewedVideo: SliderInfo;

  public videoPaginatorInfo: PaginatorInfo;
  public moreVideosAreLoading: boolean = true;
  public allVideosScrollPage: number = 1;
  public areThereAnyMoreVideos: boolean = true;
  public hasFirstVideoRoundInitFinished: boolean = false;

  public currentUserId: string;

  public scrollToBottomDistanceSubscription: Subscription;

  public highlightSeries: boolean = false;
  public highlightEpisodes: boolean = false;

  public highlightEpisodesHeader: boolean = false;

  constructor(private router: ActivatedRoute, private dataService: DataService, private utilsService: UtilsService, private navRouter: Router, private userService: UserService, 
    private seriesService: SeriesService, private notificationService: NotificationService, private videoService: VideoService, private authService: AuthService,
    private constants: Constants) { }

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();
    
    this.router.params.subscribe(params => {
      this.producerId = params['id'];
      if (!this.producerId) {
        this.utilsService.navigateToSliderNotFound();
        return;
      }
      
      this.initProducer();
      this.initSeriesSlider();
      this.initMostViewedVideoSlider();
      this.initAllVideos();

      this.scrollToBottomDistanceSubscription = this.dataService.scrollToBottomDistance.subscribe((value: number) => {
        if (value < 400 && this.areThereAnyMoreVideos && this.hasFirstVideoRoundInitFinished) {
          this.utilsService.debounce(this.getMoreVideos, 200, false, this);
        }
      });
    });
  }

  ngOnDestroy() {
    this.scrollToBottomDistanceSubscription.unsubscribe();
  }

  public initProducer(): void {
    this.userService.getProducerViewInfo(this.producerId)
    .subscribe(
      (response: BaseResponse<ProducerViewDto>) => {
        if (response.status == 500 || response.status == 404) {
          this.utilsService.navigateToSliderError();
        }
        else if (response.status == 200) {
          if (!response.data) {
            this.utilsService.navigateToSliderNotFound();
          }

          this.isproducerLoading = false;
          this.producer = response.data;

          var self = this;
          setTimeout(() => {
            self.isShowMoreDescriptionButtonVisible = self.producerDescription.nativeElement.scrollHeight != self.producerDescription.nativeElement.offsetHeight;
            self.descriptionHasTheClass = self.isShowMoreDescriptionButtonVisible;
            if (!self.descriptionHasTheClass) {
              self.descScrollableHeight = self.producerDescription.nativeElement.scrollHeight + 'px';
            }
          }, 200);

          // this.initMostViewedVideoSlider();

          // this.videoPaginatorInfo = { elements: [] } as PaginatorInfo;
          // this.initAllVideos();
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

  public initSeriesSlider(): void {
    this.seriesService.getAllOtherProducer(this.producerId)
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          if (response.status == 500) {
            this.notificationService.fail('Incarcarea emisiunilor nu a reusit');
            this.isSeriesSliderLoading = false;
          }
          else if (response.status == 200) {
            let dataElements: ElementInfo[] = [];
            if (response.data) {
              dataElements = response.data.map(a=> ({
                name: a.name,
                description: null,
                imgSrc: a.thumbnailUrl,
                redirectUrl: '/series/' + a.id,

                seriesCategory: this.constants.channelNamingMapping[a.category],
                followersCount: a.followersCount, // TODO 
                producerId: a.producerId,
                producerName: a.producerName,
                producerProfileImageUrl: a.producerProfileImageUrl,
                lastSeason: a.lastSeason,
                episodesCount: a.episodesCount
              } as ElementInfo));
            }

            this.sliderInfoSeries = {
              isSeries: true,
              isVideo: false,
              elements: dataElements
            };
            this.isSeriesSliderLoading = false;
          }
          else  {
            this.notificationService.fail('Incarcarea emisiunilor nu a reusit');
            this.isSeriesSliderLoading = false;
          }
        },
        error => {
          this.notificationService.fail('Incarcarea emisiunilor nu a reusit');
          this.isSeriesSliderLoading = false;
        }
      );
  }

  public initMostViewedVideoSlider(): void {
    this.videoService.GetMostViewedByOtherProducer(this.producerId)
    .subscribe(
      (response: BaseResponse<VideoDisplayCarouselDto[]>) => {
        if (response.status == 500) {
          this.notificationService.fail('Incarcarea episoadelor populare nu a reusit');
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

    this.videoService.getAllOtherProducerPaginated(this.producerId, input)
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

    self.videoService.getAllOtherProducerPaginated(self.producerId, input)
      .subscribe(
        (response: BaseResponse<VideoDisplayUiDto[]>) => {
          if (response.status == 500) {
            self.notificationService.fail('Incarcarea video-urilor nu a reusit');
            self.moreVideosAreLoading = false;
          }
          else if (response.status == 200) {
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
    
    this.descScrollableHeight = this.producerDescription.nativeElement.scrollHeight + 'px';
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

}
