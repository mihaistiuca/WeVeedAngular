import { Component, OnInit } from '@angular/core';
import { VideoUpdateDto } from '../../../generated-models/VideoUpdateDto';
import { DataService } from '../../../services/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../services/utils/utils.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AuthService } from '../../../services/auth/auth.service';
import { VideoService } from '../../../services/video/video.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { Location } from '@angular/common';

@Component({
  selector: 'app-delete-video',
  templateUrl: './delete-video.component.html',
  styleUrls: ['./delete-video.component.css']
})
export class DeleteVideoComponent implements OnInit {

  public videoId: string;
  public videoDto: VideoUpdateDto;
  public currentUserId: string;
  public isFormSubmitting: boolean;

  constructor(private dataService: DataService, private router: Router, private videoService: VideoService, private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute, private authService: AuthService, private notificationService: NotificationService, private _location: Location) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.videoId = params['id'];
      if (!this.videoId) {
        this.utilsService.navigateToSliderNotFound();
        return;
      }
      
      this.videoService.getUpdateDtoById(this.videoId)
        .subscribe(
          (response: BaseResponse<VideoUpdateDto>) => {
            if (response.status == 200 && response.data) {
              this.currentUserId = this.authService.getUserId();
              if(this.currentUserId != response.data.userProducerId) {
                this.utilsService.navigateToSliderNotFound();
              }

              this.videoDto = response.data;
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

  public goBack(): void {
    this._location.back();
  }

  public deleteVideo(): void {
    this.isFormSubmitting = true;

    this.videoService.delete(this.videoId)
      .subscribe(
        (response: BaseResponse) => {
          if (response.status == 200) {
            this.notificationService.success('video-ul "' + this.videoDto.title + '" a fost sters cu succes.');
            this._location.back();
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
