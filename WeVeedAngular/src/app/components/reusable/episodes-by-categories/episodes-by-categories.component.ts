import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';
import { VideoService } from '../../../services/video/video.service';
import { Constants } from '../../../constants/Constants';
import { NotificationService } from '../../../services/notification/notification.service';
import { VideoPlayingNowDto } from '../../../generated-models/VideoPlayingNowDto';
import { PaginatorInfo } from '../video-paginator/PaginatorInfo';
import { VideoDisplayCarouselDto } from '../../../generated-models/VideoDisplayCarouselDto';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { VideoDisplayUiDto } from '../../../generated-models/VideoDisplayUiDto';

@Component({
  selector: 'app-episodes-by-categories',
  templateUrl: './episodes-by-categories.component.html',
  styleUrls: ['./episodes-by-categories.component.css']
})
export class EpisodesByCategoriesComponent implements OnInit {

  public videos: VideoPlayingNowDto[];
  public videoPaginatorInfo: PaginatorInfo;
  public isVideosRequestLoading: boolean = true;

  public categoryFilterText = null;
  public selectedCategoryFilterObject = null;
  
  public optionFilterText = null;
  public optionFilterValue = null;
  
  public videosFirstFilterText: string = "Recomandate";
  public videosFirstFilterValue: string = "recommended";
  public videosFirstFilterOptions = {
    "recommended": "Recomandate",
    "new": "Cele mai noi",
    "mostViewed": "Top vizionari"
  };

  public allChannelsInfo = [];

  constructor(private utilsService: UtilsService, private videoService: VideoService, 
    private constants: Constants, private notificationService: NotificationService) { }

  ngOnInit() {
    this.allChannelsInfo = this.constants.NichedChannelsConfig;
    this.selectedCategoryFilterObject = this.constants.NichedChannelsConfig[0];

    this.categoryFilterText = this.constants.channelNamingMapping[this.selectedCategoryFilterObject.name];

    this.optionFilterText = this.videosFirstFilterText;
    this.optionFilterValue = this.videosFirstFilterValue;

    this.initEpisodes();
  }

  public initEpisodes(): void {
    this.isVideosRequestLoading = true;

    let request = null;
    if (this.optionFilterValue == 'recommended') {
      request = this.videoService.getDiscoverExploreVideosByCategory(this.selectedCategoryFilterObject.name);
    }
    else if (this.optionFilterValue == 'new') {
      request = this.videoService.getDiscoverExploreMostRecentVideosByCategory(this.selectedCategoryFilterObject.name);
    }
    else if (this.optionFilterValue == 'mostViewed') {
      request = this.videoService.getDiscoverExploreMostViewedVideosByCategory(this.selectedCategoryFilterObject.name);
    }

    request
    .subscribe(
      (response: BaseResponse<VideoDisplayUiDto[]>) => {
        if (response.status == 200) {
          this.isVideosRequestLoading = false;

          if (!response.data) {
            this.videoPaginatorInfo.halfCardElements = [];
            return;
          }

          let videoHalfCards: VideoDisplayUiDto[] = [];

          if (response.data && response.data.length) {
            videoHalfCards = response.data;
          }

          this.videoPaginatorInfo = {
            halfCardElements: videoHalfCards
          } as PaginatorInfo;
        }
        else {
          this.isVideosRequestLoading = false;
          this.notificationService.fail('Incarcarea episoadelor pe categorii nu a reusit.');
        }
      },
      error => {
        this.isVideosRequestLoading = false;
          this.notificationService.fail('Incarcarea episoadelor pe categorii nu a reusit.');
      }
    );
  }

  public selectSeriesCategoryFilter(selectedFilterValue) {
    this.selectedCategoryFilterObject = selectedFilterValue;
    this.initEpisodes();
  }

  public selectSeriesOptionFilter(selectedOption: string) {
    this.optionFilterValue = selectedOption;
    this.optionFilterText = this.videosFirstFilterOptions[selectedOption];
    this.initEpisodes();
  }
}
