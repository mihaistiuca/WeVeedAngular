import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';
import { DataService } from '../../../services/data/data.service';
import { Subscription } from 'rxjs';
import { UserBasicInfoDto } from 'src/app/generated-models/UserBasicInfoDto';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SeriesFollowInput } from 'src/app/generated-models/SeriesFollowInput';
import { SeriesService } from 'src/app/services/series/series.service';
import { BaseResponse } from 'src/app/basic-models/BaseResponse';
import { Router } from '@angular/router';
import { VideoDisplayUiDto } from '../../../generated-models/VideoDisplayUiDto';

@Component({
  selector: 'app-video-half-card',
  templateUrl: './video-half-card.component.html',
  styleUrls: ['./video-half-card.component.css']
})
export class VideoHalfCardComponent implements OnInit {
  @Input() Element: VideoDisplayUiDto;
  @Input() PaginatorIsInProducerProfile: boolean;

  public currentUserBasicInfoSubscription: Subscription;
  public currentUserInfo: UserBasicInfoDto;

  public isFollowRequestLoading: boolean;
  public isUnFollowRequestLoading: boolean;

  constructor(private utilsService: UtilsService, private dataService: DataService, private router: Router,
    private notificationService: NotificationService, private seriesService: SeriesService) { }

  ngOnDestroy() {
    this.currentUserBasicInfoSubscription.unsubscribe();
  }

  ngOnInit() {
      this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
        if(value == null) {
          return;
        }
        
        this.currentUserInfo = value;
      });
  }

  public playVideo(videoId: string): void {
    if (this.Element.encodedVideoKey == null) {
      this.notificationService.info('Acest video este in curs de procesare. In cateva minute va fi disponibil.', 12000);
      return;
    }

    this.router.navigateByUrl(videoId);
    this.utilsService.navigateInPlayer(videoId);
  }

  public navigateInSliderToUpdate(id: string): void {
    this.utilsService.navigateInSlider('/account/update-video/' + id);
  }

  public navigateInSliderToDelete(id: string): void {
    this.utilsService.navigateInSlider('/account/delete-video/' + id);
  }

}
