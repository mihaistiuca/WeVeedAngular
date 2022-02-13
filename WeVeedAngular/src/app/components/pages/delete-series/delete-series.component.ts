import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data/data.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { SeriesService } from '../../../services/series/series.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { AuthService } from '../../../services/auth/auth.service';
import { SeriesViewDto } from '../../../generated-models/SeriesViewDto';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-delete-series',
  templateUrl: './delete-series.component.html',
  styleUrls: ['./delete-series.component.css']
})
export class DeleteSeriesComponent implements OnInit {

  public seriesId: string;
  public seriesDto: SeriesViewDto;
  public currentUserId: string;
  public isFormSubmitting: boolean;

  constructor(private dataService: DataService, private router: Router, private seriesService: SeriesService, private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute, private authService: AuthService, private notificationService: NotificationService) { }

    ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
        this.seriesId = params['id'];
        if (!this.seriesId) {
          this.utilsService.navigateToSliderNotFound();
          return;
        }
        
        this.seriesService.getViewById(this.seriesId)
          .subscribe(
            (response: BaseResponse<SeriesViewDto>) => {
              if (response.status == 200 && response.data) {
                this.currentUserId = this.authService.getUserId();
                if(this.currentUserId != response.data.producerId) {
                  this.utilsService.navigateToSliderNotFound();
                }

                this.seriesDto = response.data;
              }
              else {
                this.utilsService.navigateToSliderError();
              }
            },
            error => {
              this.utilsService.navigateToSliderError();
            }
          );
      });
    }

    public backToSeries(): void {
      this.utilsService.navigateInSlider('/series/' + this.seriesId);
    }

    public deleteSeries(): void {
      this.isFormSubmitting = true;

      this.seriesService.delete(this.seriesId)
        .subscribe(
          (response: BaseResponse) => {
            if (response.status == 200) {
              this.notificationService.success('Emisiunea "' + this.seriesDto.name + '" a fost stearsa cu succes.');
              this.utilsService.navigateInSlider('/account');
            }
            else {
              this.utilsService.navigateToSliderError();
              this.isFormSubmitting = false;
            }
          },
          error => {
            this.utilsService.navigateToSliderError();
            this.isFormSubmitting = false;
          }
        );
    }

}
