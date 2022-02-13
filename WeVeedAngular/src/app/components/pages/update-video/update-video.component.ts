import { Component, OnInit, ViewChild } from '@angular/core';
import { VideoUpdateDto } from '../../../generated-models/VideoUpdateDto';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { DataService } from '../../../services/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeriesService } from '../../../services/series/series.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AwsService } from '../../../services/aws/aws.service';
import { VideoService } from '../../../services/video/video.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { Location } from '@angular/common';
import { VideoUpdateInput } from '../../../generated-models/VideoUpdateInput';

@Component({
  selector: 'app-update-video',
  templateUrl: './update-video.component.html',
  styleUrls: ['./update-video.component.css']
})
export class UpdateVideoComponent implements OnInit {

  public hasVideoCoverImageChanged: boolean = false;
  public newCoverImageSrc: string;
  public videoCoverImageEditableIsDisplayed: boolean = true;
  private userImageAwsKey: string;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public isFormSubmitting: boolean = false;

  public videoId: string;
  public videoDto: VideoUpdateDto;

  public updateVideoForm: FormGroup;

  @ViewChild('videoCoverUploader') videoCoverUploader;
  @ViewChild('formScroll') formScroll: PerfectScrollbarComponent;

  public validImageTypes = ["image/jpeg", "image/png"];

  constructor(private dataService: DataService, private router: Router, private videoService: VideoService, private utilsService: UtilsService,
    private fb: FormBuilder, private activatedRoute: ActivatedRoute, private notificationService: NotificationService,
    private awsService: AwsService, private _location: Location) { }

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
                this.videoDto = response.data;
                this.initForm();
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

    private initForm(): void {
      this.updateVideoForm = this.fb.group(
        {
          title: [this.videoDto.title, [ Validators.required, Validators.maxLength(70) ]],
          description: [this.videoDto.description, [ Validators.maxLength(1000) ]],
          thumbnailUrl: [this.videoDto.thumbnailUrl, [ Validators.maxLength(500) ] ]
        }
      );
    }

    public get title() {
      return this.updateVideoForm.get('title') as FormControl;
    }
  
    public get description() {
      return this.updateVideoForm.get('description') as FormControl;
    }
  
    public get thumbnailUrl() {
      return this.updateVideoForm.get('thumbnailUrl') as FormControl;
    }

    public submitUpdateForm(): void {
      if(!this.updateVideoForm.valid) {
        Object.keys(this.updateVideoForm.controls).forEach(field => {
          const control = this.updateVideoForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
        return;
      }
  
      this.isFormSubmitting = true;
      var self = this;
  
      if (this.hasVideoCoverImageChanged) {
        this.userImageAwsKey = this.utilsService.generateRandomString(true);
        this.awsService.uploadBinaryFile(this.croppedImage, this.userImageAwsKey, 'weveed-video-covers', function(err, data) {
          if (err) {
            self.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
            self.isFormSubmitting = false;
          }
          else {
            self.newCoverImageSrc = data.Location;
            self.sendUpdateVideoInfoToServer();
          }
        });
      }
      else {
        this.sendUpdateVideoInfoToServer();
      }
    }

    public sendUpdateVideoInfoToServer(): void {
      let videoImageUrl: string = null;
      if (this.hasVideoCoverImageChanged) {
        videoImageUrl = this.newCoverImageSrc;
      }
      else {
        videoImageUrl = this.videoDto.thumbnailUrl;
      }
  
      let input: VideoUpdateInput = {
        id: this.videoId,
        title: this.title.value,
        description: this.description.value,
        thumbnailUrl: videoImageUrl
      };
  
      this.videoService.updateVideo(input)
        .subscribe(
          (data: BaseResponse) => {
            this.isFormSubmitting = false;
  
            if(data.status == 200) {
              this._location.back();
              this.notificationService.success('Video-ul "' + this.title.value + '" a fost modificat cu succes.');
            }
            else {
              this.notificationService.fail('Ceva nu a mers bine. Incearca din nou.');
            }
          },
          error => {
            this.isFormSubmitting = false;
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou.');
          }
        )
    }
  
    fileChangeEvent(event: any): void {
      let element = this.videoCoverUploader.nativeElement;
      if(!element.files || !element.files[0]) {
        return;
      }
      var error = this.profileImageIsValid(element.files[0]);
      if (error) {
        this.notificationService.fail(error);
        return;
      }
  
      this.videoCoverImageEditableIsDisplayed = false;
      this.hasVideoCoverImageChanged = true;
      this.imageChangedEvent = event;
    }
    imageCropped(image: string) {
      this.croppedImage = image;
      // this.formScroll.directiveRef.scrollToBottom(0, 300);

      const elem = document.createElement('canvas');
      elem.width = 480;
      elem.height = 270;
      const ctx = elem.getContext('2d');

      const newImg = new Image();
      let privateSelf = this;

      newImg.onload = function() {
        ctx.drawImage(newImg, 0, 0, 480, 270);
        ctx.canvas.toBlob((blob) => {
          var reader = new FileReader();

          reader.readAsDataURL(blob); 

          reader.onloadend = function() {
            privateSelf.croppedImage = reader.result;
          }
        }, 'image/jpeg');
      }

      newImg.src = image;
    }
    imageLoaded() {
    }
    loadImageFailed() {
    }
    private profileImageIsValid(file: any): string {
      if (!this.validImageTypes.includes(file.type)) {
        return 'Va rugam selectati un fisier PNG sau JPEG';
      }
      if (file.size > 20971520) {
        return 'Imaginea trebuie sa aiba maxim 20MB';
      }
  
      return null;
    }
  
    public removeImage(): void {
      this.croppedImage = '';
      this.imageChangedEvent = '';
      this.videoCoverUploader.nativeElement.value = '';
      this.videoCoverImageEditableIsDisplayed = true;
      this.hasVideoCoverImageChanged = false;
    }

}
