import { Component, OnInit } from '@angular/core';
import { SeriesViewListDto } from '../../../generated-models/SeriesViewListDto';
import { UtilsService } from '../../../services/utils/utils.service';
import { SeriesService } from '../../../services/series/series.service';
import { AuthService } from '../../../services/auth/auth.service';
import { DataService } from '../../../services/data/data.service';
import { Constants } from '../../../constants/Constants';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-series-by-categories',
  templateUrl: './series-by-categories.component.html',
  styleUrls: ['./series-by-categories.component.css']
})
export class SeriesByCategoriesComponent implements OnInit {

  public series: SeriesViewListDto[];
  public isSeriesRequestLoading: boolean = true;

  public categoryFilterText = null;
  public selectedCategoryFilterObject = null;
  
  public optionFilterText = null;
  public optionFilterValue = null;
  
  public seriesFirstFilterText: string = "Recomandate";
  public seriesFirstFilterValue: string = "recommended";
  public seriesFirstFilterOptions = {
    "recommended": "Recomandate",
    "new": "Cele mai noi",
    "mostFollowed": "Top urmariri",
    "mostViewed": "Top vizionari"
  };

  public allChannelsInfo = [];

  constructor(private utilsService: UtilsService, private seriesService: SeriesService, private authService: AuthService, private dataService: DataService,
    private constants: Constants, private notificationService: NotificationService) { }

  ngOnInit() {
    this.allChannelsInfo = this.constants.NichedChannelsConfig;
    this.selectedCategoryFilterObject = this.constants.NichedChannelsConfig[0];

    this.categoryFilterText = this.constants.channelNamingMapping[this.selectedCategoryFilterObject.name];

    this.optionFilterText = this.seriesFirstFilterText;
    this.optionFilterValue = this.seriesFirstFilterValue;

    this.initSeries();
  }

  public initSeries(): void {
    this.isSeriesRequestLoading = true;

    let request = null;
    if (this.optionFilterValue == 'recommended') {
      request = this.seriesService.getDiscoverVideosByCategory(this.selectedCategoryFilterObject.name);
    }
    else if (this.optionFilterValue == 'new') {
      request = this.seriesService.getDiscoverMostRecentSeriesByCategory(this.selectedCategoryFilterObject.name);
    }
    else if (this.optionFilterValue == 'mostFollowed') {
      request = this.seriesService.getDiscoverSeriesFollowedAllTimeByCategory(this.selectedCategoryFilterObject.name);
    }
    else if (this.optionFilterValue == 'mostViewed') {
      request = this.seriesService.getDiscoverSeriesMostViewedAllTimeByCategory(this.selectedCategoryFilterObject.name);
    }

    // this.seriesService.getDiscoverVideosByCategory(this.selectedCategoryFilterObject.name)
    request
    .subscribe(
      (response: BaseResponse<SeriesViewListDto[]>) => {
        if (response.status == 200) {
          this.isSeriesRequestLoading = false;

          if (!response.data) {
            this.series = [];
            return;
          }

          this.series = response.data;
          let self = this;

          this.series.forEach((a: SeriesViewListDto) => {
            a.category = self.constants.channelNamingMapping[a.category];
          })
        }
        else {
          this.isSeriesRequestLoading = false;
          this.notificationService.fail('Incarcarea emisiunilor pe categorii nu a reusit.');
        }
      },
      error => {
        this.isSeriesRequestLoading = false;
          this.notificationService.fail('Incarcarea emisiunilor pe categorii nu a reusit.');
      }
    );
  }

  public navigateToSeries(id: string): void {
    this.utilsService.navigateInSlider('/series/' + id);
  }

  public selectSeriesCategoryFilter(selectedFilterValue) {
    this.selectedCategoryFilterObject = selectedFilterValue;
    this.initSeries();
  }

  public selectSeriesOptionFilter(selectedOption: string) {
    this.optionFilterValue = selectedOption;
    this.optionFilterText = this.seriesFirstFilterOptions[selectedOption];
    this.initSeries();
  }

}
