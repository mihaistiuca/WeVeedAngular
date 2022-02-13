import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';
import { SeriesService } from '../../../services/series/series.service';
import { AuthService } from '../../../services/auth/auth.service';
import { SeriesViewListDto } from '../../../generated-models/SeriesViewListDto';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { DataService } from 'src/app/services/data/data.service';
import { Constants } from 'src/app/constants/Constants';

@Component({
  selector: 'app-my-followings',
  templateUrl: './my-followings.component.html',
  styleUrls: ['./my-followings.component.css']
})
export class MyFollowingsComponent implements OnInit {

  public series: SeriesViewListDto[];
  public isMySeriesRequestLoading: boolean = true;

  constructor(private utilsService: UtilsService, private seriesService: SeriesService, private authService: AuthService, private dataService: DataService,
    private constants: Constants) { }

  ngOnInit() {
    this.initSeries();
  }

  public initSeries(): void {
    this.seriesService.getMyFollowedSeries()
    .subscribe(
      (response: BaseResponse<SeriesViewListDto[]>) => {
        if (response.status == 200) {
          if (!response.data) {
            // this means the user has been deleted from the DB
            // this.authService.logout();
            // this.dataService.changeUserBasicInfo(null);
            // this.dataService.changeShowLoginInSidebar(true);
          }

          this.isMySeriesRequestLoading = false;
          this.series = response.data;
          let self = this;
          
          if (this.series) {
            this.series.forEach((a: SeriesViewListDto) => {
              a.category = self.constants.channelNamingMapping[a.category];
            })
          }
        }
        else {
          this.utilsService.navigateToSliderError();
          this.isMySeriesRequestLoading = false;
        }
      },
      error => {
        this.utilsService.navigateToSliderError();
        this.isMySeriesRequestLoading = false;
      }
    );
  }

  public navigateToSeries(id: string): void {
    this.utilsService.navigateInSlider('/series/' + id);
  }

  public goToDiscover(): void {
    this.utilsService.navigateInSlider('/search');
  }

}
