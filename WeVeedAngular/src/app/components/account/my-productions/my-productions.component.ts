import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data/data.service';
import { ElementInfo, SliderInfo } from '../../reusable/images-slider/SliderInfo';
import { SeriesService } from '../../../services/series/series.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { ProducerSeriesDto } from '../../../generated-models/ProducerSeriesDto';
import { NotificationService } from '../../../services/notification/notification.service';
import { VideoService } from '../../../services/video/video.service';
import { VideoDisplayCarouselDto } from '../../../generated-models/VideoDisplayCarouselDto';
import { PaginatorInfo, PaginatorElement } from '../../reusable/video-paginator/PaginatorInfo';
import { AllVideoPaginateInput } from '../../../generated-models/AllVideoPaginateInput';
import { VideoDisplayUiDto } from '../../../generated-models/VideoDisplayUiDto';
import { UtilsService } from '../../../services/utils/utils.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/Constants';

@Component({
  selector: 'app-my-productions',
  templateUrl: './my-productions.component.html',
  styleUrls: ['./my-productions.component.css']
})
export class MyProductionsComponent implements OnInit, OnDestroy {

  public sliderInfoSeries: SliderInfo;
  public isSeriesSliderLoading: boolean = true;

  public sliderMostViewedVideo: SliderInfo;
  public isSliderMostViewedVideoLoading: boolean = true;

  public videoPaginatorInfo: PaginatorInfo;
  public moreVideosAreLoading: boolean = true;
  public allVideosScrollPage: number = 1;
  public areThereAnyMoreVideos: boolean = true;
  public hasFirstVideoRoundInitFinished: boolean = false;

  public scrollToBottomDistanceSubscription: Subscription;

  public currentUserId: string;
  
  constructor(private router: Router, private dataService: DataService, private seriesService: SeriesService, private videoService: VideoService, private constants: Constants,
    private notificationService: NotificationService, private utilsService: UtilsService, private authService: AuthService) { }

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();

    this.initSeriesSlider();
    this.initMostViewedVideoSlider();

    this.videoPaginatorInfo = { halfCardElements: [], paginatorIsInProducerProfile: true } as PaginatorInfo;
    this.initAllVideos();

    this.scrollToBottomDistanceSubscription = this.dataService.scrollToBottomDistance.subscribe((value: number) => {
      if (value < 400 && this.areThereAnyMoreVideos && this.hasFirstVideoRoundInitFinished) {
        this.utilsService.debounce(this.getMoreVideos, 200, false, this);
      }
    });
  }

  ngOnDestroy() {
    this.scrollToBottomDistanceSubscription.unsubscribe();
  }

  public initSeriesSlider(): void {
    this.seriesService.getAllProducer()
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
    this.videoService.getMostViewedByProducer()
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

    this.videoService.getAllProducerPaginated(input)
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
              halfCardElements: videoHalfCards,
              paginatorIsInProducerProfile: true
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

    self.videoService.getAllProducerPaginated(input)
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

  public goToCreateSeries(): void {
    // this.router.navigateByUrl('general/account/create-series');
    this.utilsService.navigateInSlider('/account/create-series');
  }

  public goToAddVideos(): void {
    // this.router.navigateByUrl('general/account/add-video');
    this.utilsService.navigateInSlider('/account/add-video');
  }

}
