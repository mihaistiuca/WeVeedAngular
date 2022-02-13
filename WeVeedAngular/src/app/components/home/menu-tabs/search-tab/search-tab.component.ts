import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExploreService } from '../../../../services/explore/explore.service';
import { BaseResponse } from '../../../../basic-models/BaseResponse';
import { ProducerListViewDto } from '../../../../generated-models/ProducerListViewDto';
import { NotificationService } from '../../../../services/notification/notification.service';
import { ProdSliderInfo, ProdElementInfo } from '../../../../components/producer-slider/ProdSliderInfo';
import { SliderInfo, ElementInfo } from '../../../../components/reusable/images-slider/SliderInfo';
import { ProducerSeriesDto } from '../../../../generated-models/ProducerSeriesDto';
import { Constants } from '../../../../constants/Constants';
import { VideoWatchDto } from '../../../../generated-models/VideoWatchDto';
import { DataService } from '../../../../services/data/data.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SearchProducerInput } from '../../../../generated-models/SearchProducerInput';
import { SearchSeriesInput } from '../../../../generated-models/SearchSeriesInput';
import { UtilsService } from '../../../../services/utils/utils.service';
import { PaginatorInfo } from '../../../../components/reusable/video-paginator/PaginatorInfo';
import { SearchVideoInput } from '../../../../generated-models/SearchVideoInput';
import { VideoDisplayCarouselDto } from '../../../../generated-models/VideoDisplayCarouselDto';
import { Subscription } from 'rxjs';
import { VideoDisplayUiDto } from '../../../../generated-models/VideoDisplayUiDto';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.css']
})
export class SearchTabComponent implements OnInit, OnDestroy {

  public globalSelf: any;

  public playingNowItem: string;
  public currentUserId: string;
  public channelConfigs: any[];

  public searchValue: string;

  public isProducersRequestLoading: boolean = true;
  public producers: ProducerListViewDto[];
  public sliderInfoProducer: ProdSliderInfo;

  public isSeriesRequestLoading: boolean = true;
  public series: ProducerSeriesDto[];
  public sliderInfoSeries: SliderInfo;


  public isVideo_General_RequestLoading: boolean = true;
  public isVideo_Entertainment_RequestLoading: boolean = true;
  public isVideo_Educational_RequestLoading: boolean = true;
  public isVideo_News_RequestLoading: boolean = true;
  public isVideo_Tech_RequestLoading: boolean = true;
  public isVideo_Travel_RequestLoading: boolean = true;
  public isVideo_Fashion_RequestLoading: boolean = true;
  public isVideo_Sport_RequestLoading: boolean = true;
  public isVideo_Kids_RequestLoading: boolean = true;
  public isVideo_Cooking_RequestLoading: boolean = true;
  public isVideo_Automoto_RequestLoading: boolean = true;
  public isVideo_Gaming_RequestLoading: boolean = true;
  public isVideo_Music_RequestLoading: boolean = true;
  public isVideo_Vlog_RequestLoading: boolean = true;

  public sliderInfoVideo_General: SliderInfo;
  public sliderInfoVideo_Entertainment: SliderInfo;
  public sliderInfoVideo_Educational: SliderInfo;
  public sliderInfoVideo_News: SliderInfo;
  public sliderInfoVideo_Tech: SliderInfo;
  public sliderInfoVideo_Travel: SliderInfo;
  public sliderInfoVideo_Fashion: SliderInfo;
  public sliderInfoVideo_Sport: SliderInfo;
  public sliderInfoVideo_Kids: SliderInfo;
  public sliderInfoVideo_Cooking: SliderInfo;
  public sliderInfoVideo_Automoto: SliderInfo;
  public sliderInfoVideo_Gaming: SliderInfo;
  public sliderInfoVideo_Music: SliderInfo;
  public sliderInfoVideo_Vlog: SliderInfo;

  // SEARCHED VIDEOS 
  public isVideosSearchedRequestLoading: boolean = false;
  public paginatorInfoVideos: PaginatorInfo;

  public playingNowItemSubscription: Subscription;

  // PRODUCER
  public producersFirstFilterText: string = "Recomandati";
  public producersFirstFilterValue: string = "recommended";
  public producerFirstFilterOptions = {
    "recommended": "Recomandati",
    "new": "Cei mai noi",
    "mostFollowed": "Top urmariri",
    "mostViewed": "Top vizionari"
  };

  public producerFollowFilterText: string = "Ultima saptamana";
  public producerFollowFilterValue: string = "lastweek";
  public producerFollowFilterOptions = {
    "lastweek": "Ultima saptamana",
    "lastmonth": "Ultima luna",
    "alltime": "Din totdeauna"
  };

  public producerViewedFilterText: string = "Ultima saptamana";
  public producerViewedFilterValue: string = "lastweek";
  public producerViewedFilterOptions = {
    "lastweek": "Ultima saptamana",
    "lastmonth": "Ultima luna",
    "alltime": "Din totdeauna"
  };

  // SERIES
  public seriesFirstFilterText: string = "Recomandate";
  public seriesFirstFilterValue: string = "recommended";
  public seriesFirstFilterOptions = {
    "recommended": "Recomandate",
    "new": "Cele mai noi",
    "mostFollowed": "Top urmariri",
    "mostViewed": "Top vizionari"
  };

  public seriesFollowFilterText: string = "Ultima saptamana";
  public seriesFollowFilterValue: string = "lastweek";
  public seriesFollowFilterOptions = {
    "lastweek": "Ultima saptamana",
    "lastmonth": "Ultima luna",
    "alltime": "Din totdeauna"
  };

  public seriesViewedFilterText: string = "Ultima saptamana";
  public seriesViewedFilterValue: string = "lastweek";
  public seriesViewedFilterOptions = {
    "lastweek": "Ultima saptamana",
    "lastmonth": "Ultima luna",
    "alltime": "Din totdeauna"
  };

  constructor(private exploreService: ExploreService, private notificationService: NotificationService, private constants: Constants,
    private dataService: DataService, private authService: AuthService, private utilsService: UtilsService) { }

  ngOnInit() {

    this.globalSelf = this;
    let self = this;
    this.channelConfigs = this.constants.ChannelsConfig;
    // this.channelConfigs.shift();
    this.currentUserId = this.authService.getUserId();
    this.playingNowItemSubscription = this.dataService.playingNowItem.subscribe((value: string) => {
      this.playingNowItem = value;
    });

    this.loadExploreProducers();
    this.loadExploreSeries();

    this.constants.ChannelsConfig.forEach(a => {
      self.loadExploreVideosForChannel(a.name);
    });
  }

  ngOnDestroy() {
    this.playingNowItemSubscription.unsubscribe();
  }

  public emptySearchFiled(): void {
    this.searchValue = null;
    this.loadExploreProducers();
    this.loadExploreSeries();
  }

  public loadExploreProducers(): void {
    this.isProducersRequestLoading = true;

    this.exploreService.getDiscoverProducers()
    .subscribe(
      (response: BaseResponse<ProducerListViewDto[]>) => {
        if (response.status == 200) {
          this.producers = response.data;

          let dataElements: ProdElementInfo[] = [];
          if (response.data) {
            dataElements = response.data.map(a=> ({
              id: a.id,
              isNew: a.isNew,
              producerName: a.producerName,
              profileImageUrl: a.profileImageUrl,
              redirectUrl: '/producer/' + a.id
            } as ProdElementInfo));
          }

          this.sliderInfoProducer = {
            elements: dataElements
          };
          this.isProducersRequestLoading = false;
        }
        else if( response.status == 500) {
          this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
          this.isProducersRequestLoading = false;
        }
        else {
          this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
          this.isProducersRequestLoading = false;
        }
      },
      error => {
          this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
          this.isProducersRequestLoading = false;
        }
    );
  }

  public loadExploreSeries(): void {
    this.isSeriesRequestLoading = true;

    this.exploreService.getDiscoverSeries()
    .subscribe(
      (response: BaseResponse<ProducerSeriesDto[]>) => {
        if (response.status == 200) {
          this.series = response.data;

          let dataElements: ElementInfo[] = [];
          if (response.data) {
            dataElements = response.data.map(a=> ({
              name: a.name,
              description: null,
              imgSrc: a.thumbnailUrl,
              redirectUrl: '/series/' + a.id,

              seriesCategory: this.constants.channelNamingMapping[a.category],
              followersCount: a.followersCount,
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
          this.isSeriesRequestLoading = false;
        }
        else if( response.status == 500) {
          this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
          this.isSeriesRequestLoading = false;
        }
        else {
          this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
          this.isSeriesRequestLoading = false;
        }
      },
      error => {
          this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
          this.isSeriesRequestLoading = false;
        }
    );
  }

  public loadExploreVideosForChannel(channelName: string): void {
    let channelConfigObj = this.constants.ChannelsConfig.filter(a=>a.name == channelName)[0];

    this['isVideo_' + channelConfigObj.capitalName + '_RequestLoading'] = true;

    this.exploreService.getDiscoverVideosForChannel(channelName)
      .subscribe(
        (response: BaseResponse<VideoDisplayCarouselDto[]>) => {
          if (response.status == 200) {

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
            };

            this['sliderInfoVideo_' + channelConfigObj.capitalName] = {
              isSeries: false,
              isVideo: true,
              elements: dataElements
            };
            this['isVideo_' + channelConfigObj.capitalName + '_RequestLoading'] = false;
          }
          else if( response.status == 500) {
            this.notificationService.fail('Lista episoadelor nu a putut fi incarcata.');
            this['isVideo_' + channelConfigObj.capitalName + '_RequestLoading'] = false;
          }
          else {
            this.notificationService.fail('Lista episoadelor nu a putut fi incarcata.');
            this['isVideo_' + channelConfigObj.capitalName + '_RequestLoading'] = false;
          }
        },
        error => {
            this.notificationService.fail('Lista episoadelor nu a putut fi incarcata.');
            this['isVideo_' + channelConfigObj.capitalName + '_RequestLoading'] = false;
          }
      );
  }

  public loadSearchProducers(): void {
    this.isProducersRequestLoading = true;

    let input: SearchProducerInput = {
      word: this.searchValue
    };

    this.sliderInfoProducer = null;

    this.exploreService.getSearchProducers(input)
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          if (response.status == 200) {
            this.producers = response.data;

            let dataElements: ProdElementInfo[] = [];
            if (response.data) {
              dataElements = response.data.map(a=> ({
                id: a.id,
                isNew: a.isNew,
                producerName: a.producerName,
                profileImageUrl: a.profileImageUrl,
                redirectUrl: '/producer/' + a.id
              } as ProdElementInfo));
            }

            this.sliderInfoProducer = {
              elements: dataElements
            };
            this.isProducersRequestLoading = false;
          }
          else if( response.status == 500) {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
          else {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public loadSearchSeries(): void {
    this.isSeriesRequestLoading = true;

    let input: SearchSeriesInput = {
      word: this.searchValue
    };

    this.sliderInfoSeries = null;

    this.exploreService.getSearchSeries(input)
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          if (response.status == 200) {
            this.series = response.data;

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
            this.isSeriesRequestLoading = false;
          }
          else if( response.status == 500) {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
          else {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public loadSearchVideos(): void {
    this.isVideosSearchedRequestLoading = true;

    let input: SearchVideoInput = {
      word: this.searchValue
    };

    this.paginatorInfoVideos = null;

    this.exploreService.getSearchVideos(input)
      .subscribe(
        (response: BaseResponse<VideoDisplayUiDto[]>) => {
          if (response.status == 200) {
            let videoHalfCards: VideoDisplayUiDto[] = [];

            if (response.data && response.data.length) {
              videoHalfCards = response.data;
            }

            this.paginatorInfoVideos = {
              halfCardElements: videoHalfCards
            } as PaginatorInfo;
            
            this.isVideosSearchedRequestLoading = false;
          }
          else if( response.status == 500) {
            this.notificationService.fail('Lista episoadelor nu a putut fi incarcata.');
            this.isVideosSearchedRequestLoading = false;
          }
          else {
            this.notificationService.fail('Lista episoadelor nu a putut fi incarcata.');
            this.isVideosSearchedRequestLoading = false;
          }
        },
        error => {
            this.notificationService.fail('Lista episoadelor nu a putut fi incarcata.');
            this.isVideosSearchedRequestLoading = false;
          }
      );
  }

  // IMPORTANT
  public beginSearchForAllEntities(self): void {
    self.loadSearchProducers();
    self.loadSearchSeries();
    self.loadSearchVideos();
  }

  public onChangeSearch(e): void {
    this.searchValue = e;
    this.utilsService.debounce(this.beginSearchForAllEntities, 200, false, this);
  }

  // PRODUCER FILTERS
  // ----------------------------------------------------------------------------------------------------------------------------------
  public selectProducerFirstFilter(selectedFilterValue: string) {
    this.producersFirstFilterValue = selectedFilterValue;
    this.producersFirstFilterText = this.producerFirstFilterOptions[selectedFilterValue];

    if (selectedFilterValue == "recommended") {
      this.loadExploreProducers();
      return;
    }
    else if (selectedFilterValue == "new") {
      this.isProducersRequestLoading = true;
      this.getDiscoverProducersMostRecent();
    }
    else if(selectedFilterValue == "mostFollowed") {
      this.isProducersRequestLoading = true;

      if (this.producerFollowFilterValue == "lastweek") {
        this.getDiscoverProducersFollowedWeekly();
      }
      else if (this.producerFollowFilterValue == "lastmonth") {
        this.getDiscoverProducersFollowedMonthly();
      }
      else {
        this.getDiscoverProducersFollowedAllTime();
      }
    }
    else if(selectedFilterValue == "mostViewed") {
      this.isProducersRequestLoading = true;

      if (this.producerViewedFilterValue == "lastweek") {
        this.getDiscoverProducersMostViewedWeekly();
      }
      else if (this.producerViewedFilterValue == "lastmonth") {
        this.getDiscoverProducersMostViewedMonthly();
      }
      else {
        this.getDiscoverProducersMostViewedAllTime();
      }
    }
  }

  public selectProducerFollowFilter(selectedFilterValue: string) {
    this.producerFollowFilterValue = selectedFilterValue;
    this.producerFollowFilterText = this.producerFollowFilterOptions[selectedFilterValue];

    this.isProducersRequestLoading = true;

    if (this.producerFollowFilterValue == "lastweek") {
      this.getDiscoverProducersFollowedWeekly()
    }
    else if (this.producerFollowFilterValue == "lastmonth") {
      this.getDiscoverProducersFollowedMonthly()
    }
    else {
      this.getDiscoverProducersFollowedAllTime()
    }
  }

  public selectProducerViewFilter(selectedFilterValue: string) {
    this.producerViewedFilterValue = selectedFilterValue;
    this.producerViewedFilterText = this.producerViewedFilterOptions[selectedFilterValue];

    this.isProducersRequestLoading = true;

    if (this.producerViewedFilterValue == "lastweek") {
      this.getDiscoverProducersMostViewedWeekly()
    }
    else if (this.producerViewedFilterValue == "lastmonth") {
      this.getDiscoverProducersMostViewedMonthly()
    }
    else {
      this.getDiscoverProducersMostViewedAllTime()
    }
  }

  public getDiscoverProducersMostRecent() {
    this.exploreService.getDiscoverProducersMostRecent()
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          this.producerFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public getDiscoverProducersFollowedWeekly() {
    this.exploreService.getDiscoverProducersFollowedWeekly()
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          this.producerFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public getDiscoverProducersFollowedMonthly() {
    this.exploreService.getDiscoverProducersFollowedMonthly()
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          this.producerFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public getDiscoverProducersFollowedAllTime() {
    this.exploreService.getDiscoverProducersFollowedAllTime()
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          this.producerFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public getDiscoverProducersMostViewedWeekly() {
    this.exploreService.getDiscoverProducersMostViewedWeekly()
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          this.producerFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public getDiscoverProducersMostViewedMonthly() {
    this.exploreService.getDiscoverProducersMostViewedMonthly()
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          this.producerFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public getDiscoverProducersMostViewedAllTime() {
    this.exploreService.getDiscoverProducersMostViewedAllTime()
      .subscribe(
        (response: BaseResponse<ProducerListViewDto[]>) => {
          this.producerFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
            this.isProducersRequestLoading = false;
          }
      );
  }

  public producerFilterResponseHandler(response: BaseResponse<ProducerListViewDto[]>) {
    if (response.status == 200) {
      this.producers = response.data;

      let dataElements: ProdElementInfo[] = [];
      if (response.data) {
        dataElements = response.data.map(a=> ({
          id: a.id,
          isNew: a.isNew,
          producerName: a.producerName,
          profileImageUrl: a.profileImageUrl,
          redirectUrl: '/producer/' + a.id
        } as ProdElementInfo));
      }

      this.sliderInfoProducer = {
        elements: dataElements
      };
      this.isProducersRequestLoading = false;
    }
    else if( response.status == 500) {
      this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
      this.isProducersRequestLoading = false;
    }
    else {
      this.notificationService.fail('Lista producatorilor nu a putut fi incarcata.');
      this.isProducersRequestLoading = false;
    }
  }

  // ----------------------------------------------------------------------------------------------------------------------------------

  // SERIES FILTERS
  // ----------------------------------------------------------------------------------------------------------------------------------
  public selectSeriesFirstFilter(selectedFilterValue: string) {
    this.seriesFirstFilterValue = selectedFilterValue;
    this.seriesFirstFilterText = this.seriesFirstFilterOptions[selectedFilterValue];

    if (selectedFilterValue == "recommended") {
      this.loadExploreSeries();
      return;
    }
    else if (selectedFilterValue == "new") {
      this.isSeriesRequestLoading = true;
      this.getDiscoverSeriesMostRecent();
    }
    else if(selectedFilterValue == "mostFollowed") {
      this.isSeriesRequestLoading = true;

      if (this.seriesFollowFilterValue == "lastweek") {
        this.getDiscoverSeriesFollowedWeekly();
      }
      else if (this.seriesFollowFilterValue == "lastmonth") {
        this.getDiscoverSeriesFollowedMonthly();
      }
      else {
        this.getDiscoverSeriesFollowedAllTime();
      }
    }
    else if(selectedFilterValue == "mostViewed") {
      this.isSeriesRequestLoading = true;

      if (this.seriesViewedFilterValue == "lastweek") {
        this.getDiscoverSeriesMostViewedWeekly();
      }
      else if (this.seriesViewedFilterValue == "lastmonth") {
        this.getDiscoverSeriesMostViewedMonthly();
      }
      else {
        this.getDiscoverSeriesMostViewedAllTime();
      }
    }
  }

  public selectSeriesFollowFilter(selectedFilterValue: string) {
    this.seriesFollowFilterValue = selectedFilterValue;
    this.seriesFollowFilterText = this.seriesFollowFilterOptions[selectedFilterValue];

    this.isSeriesRequestLoading = true;

    if (this.seriesFollowFilterValue == "lastweek") {
      this.getDiscoverSeriesFollowedWeekly();
    }
    else if (this.seriesFollowFilterValue == "lastmonth") {
      this.getDiscoverSeriesFollowedMonthly();
    }
    else {
      this.getDiscoverSeriesFollowedAllTime();
    }
  }

  public selectSeriesViewedFilter(selectedFilterValue: string) {
    this.seriesViewedFilterValue = selectedFilterValue;
    this.seriesViewedFilterText = this.seriesViewedFilterOptions[selectedFilterValue];

    this.isSeriesRequestLoading = true;

    if (this.seriesViewedFilterValue == "lastweek") {
      this.getDiscoverSeriesMostViewedWeekly();
    }
    else if (this.seriesViewedFilterValue == "lastmonth") {
      this.getDiscoverSeriesMostViewedMonthly();
    }
    else {
      this.getDiscoverSeriesMostViewedAllTime();
    }
  }

  public getDiscoverSeriesMostRecent() {
    this.exploreService.getDiscoverMostRecentSeries()
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          this.seriesFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public getDiscoverSeriesFollowedWeekly() {
    this.exploreService.getDiscoverSeriesFollowedWeekly()
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          this.seriesFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public getDiscoverSeriesFollowedMonthly() {
    this.exploreService.getDiscoverSeriesFollowedMonthly()
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          this.seriesFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public getDiscoverSeriesFollowedAllTime() {
    this.exploreService.getDiscoverSeriesFollowedAllTime()
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          this.seriesFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public getDiscoverSeriesMostViewedWeekly() {
    this.exploreService.getDiscoverSeriesMostViewedWeekly()
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          this.seriesFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public getDiscoverSeriesMostViewedMonthly() {
    this.exploreService.getDiscoverSeriesMostViewedMonthly()
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          this.seriesFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public getDiscoverSeriesMostViewedAllTime() {
    this.exploreService.getDiscoverSeriesMostViewedAllTime()
      .subscribe(
        (response: BaseResponse<ProducerSeriesDto[]>) => {
          this.seriesFilterResponseHandler(response);
        },
        error => {
            this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
            this.isSeriesRequestLoading = false;
          }
      );
  }

  public seriesFilterResponseHandler(response: BaseResponse<ProducerSeriesDto[]>) {
    if (response.status == 200) {
      this.series = response.data;

      let dataElements: ElementInfo[] = [];
      if (response.data) {
        dataElements = response.data.map(a=> ({
          name: a.name,
          description: null,
          imgSrc: a.thumbnailUrl,
          redirectUrl: '/series/' + a.id,

          seriesCategory: this.constants.channelNamingMapping[a.category],
          followersCount: a.followersCount,
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
      this.isSeriesRequestLoading = false;
    }
    else if( response.status == 500) {
      this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
      this.isSeriesRequestLoading = false;
    }
    else {
      this.notificationService.fail('Lista emisiunilor nu a putut fi incarcata.');
      this.isSeriesRequestLoading = false;
    }
  }

  // ----------------------------------------------------------------------------------------------------------------------------------
}
