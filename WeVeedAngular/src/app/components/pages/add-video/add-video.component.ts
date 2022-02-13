import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VideoProcessingService } from '../../../services/video-processing-service/video-processing-service.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { FileSystemDirectoryEntry, UploadEvent, FileSystemFileEntry, UploadFile } from 'ngx-file-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesService } from '../../../services/series/series.service';
import { BaseResponse, IdResponse } from '../../../basic-models/BaseResponse';
import { SeriesLastEpisodeDto } from '../../../generated-models/SeriesLastEpisodeDto';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NextEpisodeChoice } from './NextEpisodeChoice';
import { VideoService } from '../../../services/video/video.service';
import { AwsService } from '../../../services/aws/aws.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { VideoCreateInput } from '../../../generated-models/VideoCreateInput';
import { Location } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('200ms', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        style({transform: 'translateX(100%)', opacity: 1}),
        animate('200ms', style({transform: 'translateX(100%)', opacity: 0}))
      ])
    ]),
    trigger('changeDivSize', [
      state('unset', style({
        width: '93%',
      })),
      state('set', style({
        width: '100%',
      })),
      transition('unset=>set', animate('200ms')),
      transition('set=>unset', animate('200ms'))
    ])
  ]
})
export class AddVideoComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;

  @ViewChild('imageInputCover') imageInputCover;
  public hasSeriesCoverImageChanged: boolean = false;
  public newCoverImageSrc: string;
  public seriesCoverImageEditableIsDisplayed: boolean = true;
  @ViewChild('formScroll') formScroll: PerfectScrollbarComponent;
  public validImageTypes = ["image/jpeg", "image/png"];
  public imageChangedEvent: any = '';
  public croppedImage: any = '';

  public thumbnailData1: string;
  public thumbnailData2: string;
  public thumbnailData3: string;
  public thumbnailData4: string;
  public thumbnailData5: string;
  public thumbnailData6: string;

  public thumbnail1IsSelected: boolean = false;
  public thumbnail2IsSelected: boolean = false;
  public thumbnail3IsSelected: boolean = false;
  public thumbnail4IsSelected: boolean = false;
  public thumbnail5IsSelected: boolean = false;
  public thumbnail6IsSelected: boolean = false;

  public paramSeriesId: string = null;
  public files: UploadFile[] = [];

  public seriesExistLoading: boolean = false;
  public selectedSeries: SeriesLastEpisodeDto;
  public seriesCurrentState: string = 'unset';
  public episodeSeriesChoices: NextEpisodeChoice[] = [];
  public selectedEpisodeSeriesChoice: NextEpisodeChoice;

  public allSeriesRequestLoading: boolean = false;
  public allSeries: SeriesLastEpisodeDto[];

  public videoIsSelected: boolean = false;

  public selectedThumbnailData: string;

  public isFormSubmitting: boolean = false;

  public videoFile: File;
  public loadingVideoPercentage: number = 0;
  public videoAwsKey: string;

  public loadingThumbnailPercentage: number = 0;
  public thumbnailAwsKey: string;
  public thumbnailFinalUrl: string;

  public controlbarThumbsAwsKey: string;
  public controlbarThumbsFinalUrl: string;

  public loadingVideoProgressVisible: boolean = true;
  public loadingThumbnailProgressVisible: boolean = false;
  public loadingFormSubmitVisible: boolean = false;
  public videoFinalUrl: string;

  public videoLength: number;

  public isSelectionLoading: boolean;

  constructor(private videoProcessingService: VideoProcessingService, private notificationService: NotificationService, private fb: FormBuilder,
    private route: ActivatedRoute, private seriesService: SeriesService, private router: Router, private videoService: VideoService,
    private awsService: AwsService, private utilsService: UtilsService, private location: Location) { 
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['seriesid']) {
        this.paramSeriesId = params['seriesid'];
        this.initWithSeries(params['seriesid']);
      }
      else {
        this.initWithoutSeries();
      }
    });
  }

  public addVideoForm = this.fb.group(
    {
      title: ['', [ Validators.required, Validators.maxLength(70) ]],
      description: ['', [ Validators.maxLength(1000) ]]
    }
  );

  public keyDownFunctionOnForm(event) {
    if (event.srcElement.classList.contains("prevent-enter-submit")) {
      return;
    }
    if(event.keyCode == 13) {
      this.uploadVideoAndSubmit();
    }
  }

  public uploadVideoAndSubmit(): void {
    if (!this.selectedThumbnailData) {
      this.notificationService.fail('Trebuie sa alegi o coperta pentru video-ul tau.');
      return;
    }

    if (!this.addVideoForm.valid) {
      Object.keys(this.addVideoForm.controls).forEach(field => {
        const control = this.addVideoForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isFormSubmitting = true;
    var self = this;

    this.videoAwsKey = this.utilsService.generateRandomString(false);

    this.awsService.uploadFileWithProgress(this.videoFile, this.videoAwsKey, 'weveed-src-videos', function(evt: any) {
      self.loadingVideoPercentage = Math.floor((evt.loaded * 100) / evt.total);
    }, function(err, data) {
      if (err) {
        self.notificationService.fail('Ceva nu a mers bine. Te rugam sa incerci din nou.');
        return;
      }

      self.videoFinalUrl = data.Location;
      self.loadingVideoProgressVisible = false;
      self.loadingThumbnailProgressVisible = true;

      self.uploadThumbnailAndSubmit();
    });
  }

  public uploadThumbnailAndSubmit(): void {
    this.thumbnailAwsKey = this.utilsService.generateRandomString(true);
    let self = this;

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
          // privateSelf.croppedImage = reader.result;
          privateSelf.awsService.uploadBinaryFileWithProgress(reader.result, privateSelf.thumbnailAwsKey, 'weveed-video-covers', function(evt: any) {
            self.loadingThumbnailPercentage = Math.floor((evt.loaded * 100) / evt.total);
          }, function(err, data) {
            if (err) {
              self.notificationService.fail('Ceva nu a mers bine. Te rugam sa incerci din nou.');
              return;
            }
            
            self.thumbnailFinalUrl = data.Location;
            self.loadingVideoProgressVisible = false;
            self.loadingThumbnailProgressVisible = false;
            self.loadingFormSubmitVisible = true;
      
            self.submitForm();
          });
        }
      }, 'image/jpeg');
    }

    newImg.src = this.selectedThumbnailData;
  }

  public submitForm(): void {
    let self = this;
    let seriesId: string = null;
    let seriesCategory: string = null;
    if (self.selectedSeries) {
      seriesId = self.selectedSeries.id;
      seriesCategory = self.selectedSeries.category;
    }

    let input = {
      title: self.title.value,
      description: self.description.value,
      season: self.selectedEpisodeSeriesChoice ? self.selectedEpisodeSeriesChoice.nextSeason : null,
      episode: self.selectedEpisodeSeriesChoice ? self.selectedEpisodeSeriesChoice.nextEpisode : null,
      seriesId: seriesId,
      seriesCategory: seriesCategory,
      thumbnailUrl: self.thumbnailFinalUrl,
      videoUrl: self.videoFinalUrl,
      length: this.videoLength,
      controlbarThumbnailsUrl: ''
    } as VideoCreateInput;

    this.controlbarThumbsAwsKey = this.utilsService.generateRandomString(false) + '.jpg';
    let canvas: HTMLCanvasElement = this.canvas.nativeElement;
    let progressThumbnails = canvas.toDataURL();

    // this.awsService.uploadBinaryFileWithProgress(progressThumbnails, this.controlbarThumbsAwsKey, 'weveed-controlbar-thumbs', function(evt: any) {
    //   // self.loadingThumbnailPercentage = Math.floor((evt.loaded * 100) / evt.total);
    // }, function(err, data) {
    //   if (err) {
    //     self.notificationService.fail('Ceva nu a mers bine. Te rugam sa incerci din nou.');
    //     return;
    //   }
      
    //   self.controlbarThumbsFinalUrl = data.Location;
    //   input.controlbarThumbnailsUrl = self.controlbarThumbsFinalUrl;

    self.videoService.create(input)
      .subscribe(
        (data: BaseResponse<IdResponse>) => {
          self.isFormSubmitting = false;
          if (data.status == 200) {
            self.location.back();
            self.notificationService.success('Un nou video a fost adaugat cu succes in emisiunea ' + self.selectedSeries.name + '.');
          }
          else {
            self.notificationService.fail('Ceva nu a mers bine. Te rugam sa incerci din nou.');
          }
        },
        error => {
          self.isFormSubmitting = false;
          self.notificationService.fail('Ceva nu a mers bine. Te rugam sa incerci din nou.');
        }
      );
    // });
  };

  public backToProfile(): void {
    // this.router.navigate(['../'], { relativeTo: this.route });
    this.utilsService.navigateInSlider('/account');
  }

  public get title() {
    return this.addVideoForm.get('title') as FormControl;
  }

  public get description() {
    return this.addVideoForm.get('description') as FormControl;
  }

  public selectSeries(series: SeriesLastEpisodeDto): void {
    this.selectedSeries = series;
    this.initNextEpisodeChoices(this.selectedSeries);
    if (series) {
      this.seriesCurrentState = 'set';
    }
    else {
      this.seriesCurrentState = 'unset';
    }
  }
  
  public compareFn(choice1: NextEpisodeChoice, choice2: NextEpisodeChoice): boolean {
    return choice1.nextEpisode == choice2.nextEpisode && choice1.nextSeason == choice2.nextSeason;
  }

  private initWithSeries(seriesId: string): void {
    this.seriesExistLoading = true;
    this.seriesService.seriesExistWithLastEpisodes(seriesId)
      .subscribe(
        (data: BaseResponse<SeriesLastEpisodeDto>) => {
          this.seriesExistLoading = false;

          if (!data || !data.data) {
            this.router.navigate(['not-found']);
            return;
          }
          else if (data.status == 401) {
            this.router.navigate(['not-accessable']);
            return;
          }
          else if (data.status == 500 || data.status == 422) {
            this.notificationService.fail('Ceva nu a mers bine. Acceseaza pagina din nou.');
            return;
          }
          else if (data.status == 200) {
            this.selectedSeries = data.data;
            this.initNextEpisodeChoices(this.selectedSeries);
          }
        },
        error => {
          this.seriesExistLoading = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      )
  }

  private initWithoutSeries(): void {
    this.allSeriesRequestLoading = true;
    this.seriesService.getAllWithLastEpisodes()
      .subscribe(
        (data: BaseResponse<SeriesLastEpisodeDto[]>) => {
          this.allSeriesRequestLoading = false;

          if (!data) {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
            return;
          }
          else if (data.status == 401) {
            this.router.navigate(['not-accessable']);
            return;
          }
          else if (data.status == 500) {
            this.notificationService.fail('Ceva nu a mers bine. Acceseaza pagina din nou.');
            return;
          }
          else if (data.status == 200) {
            this.allSeries = data.data;
          }
        }
      )
  }

  private initNextEpisodeChoices(series: SeriesLastEpisodeDto): void {
    if (!series || series.lastEpisode < 0 || series.lastSeason < 0) {
      this.episodeSeriesChoices = [];
      this.selectedEpisodeSeriesChoice = null;
      return;
    }

    if (series.lastEpisode == 0 && series.lastSeason == 0) {
      this.episodeSeriesChoices = [{ nextEpisode: 1, nextSeason: 1 } as NextEpisodeChoice];
    }
    else {
      this.episodeSeriesChoices = [{ nextEpisode: series.lastEpisode + 1, nextSeason: series.lastSeason } as NextEpisodeChoice, 
        { nextEpisode: 1, nextSeason: series.lastSeason + 1 } as NextEpisodeChoice];
    }
    
    this.selectedEpisodeSeriesChoice = this.episodeSeriesChoices[0];
  }
 
  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.add(file);
        });
      } else {
        this.notificationService.fail('Ceva nu a mers bine in selectarea video-ului.');
      }
    }
  }
 
  public fileOver(event){
  }
 
  public fileLeave(event){
  }

  // public capture(): void {
  //   var canvas: any = document.getElementById('canvas');
  //   var video: any = document.getElementById('video');
  //   canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  // }

  public add(droppedFile: File): void {

    this.videoProcessingService.promptForVideo(droppedFile).then(videoFile => {
      this.isSelectionLoading = true;
      let isVideoValid = this.validateVideo(videoFile);
      if (!isVideoValid) {
        this.isSelectionLoading = false;
        
        return null;
      }
      this.videoFile = videoFile;

      return this.videoProcessingService.generateThumbnails(videoFile);
    }).then(thumbnailData => {
      if (thumbnailData) {
        this.thumbnailData1 = thumbnailData[1];
        this.thumbnailData2 = thumbnailData[2];
        this.thumbnailData3 = thumbnailData[3];
        this.thumbnailData4 = thumbnailData[4];
        this.thumbnailData5 = thumbnailData[5];
        this.thumbnailData6 = thumbnailData[6];

        this.videoLength = Math.floor(thumbnailData[7] as number);

        this.videoIsSelected = true;
        this.isSelectionLoading = false;

        // return this.videoProcessingService.generateAllThumbnails(thumbnailData[0] as Blob);
      }
    })
    // .then(allThumbnailData => {
    //   if (allThumbnailData) {
    //     let canvas: HTMLCanvasElement = this.canvas.nativeElement;
    //     let context = canvas.getContext('2d');
    //     canvas.width = 160 * (allThumbnailData.length);
    //     canvas.height = 88;
        
    //     var images = [];

    //     for (let i = 0; i < allThumbnailData.length; i++) {
    //       images.push(new Image());

    //       images[i].onload = function() {
    //         context.drawImage(this, i * 160, 0, 160, 88);
    //       }

    //       images[i].src = allThumbnailData[i];
    //     }

    //     this.videoIsSelected = true;
    //     this.isSelectionLoading = false;
    //   }
    // })
    .catch(error => {
        this.isSelectionLoading = false;
        this.notificationService.fail('Ceva nu a mers bine. Va rugam sa incercati din nou. Extensia fisierului selectat poate fi cauza problemei.', 10000);
    });
  }

  private validateVideo(videoFile: File): boolean {
    if (!videoFile.type.includes('video/')) {
      this.notificationService.fail('Te rugam sa alegi un fisier video valid.');
      return false;
    }
    if (videoFile.size > 137438953472) {
      this.notificationService.fail('Dimensiunea maxima pentru un video este de 128GB.');
      return false;
    }

    return true;
  }


  // add video thumbnail 
  
  fileChangeEvent(event: any): void {
    let element = this.imageInputCover.nativeElement;
    if(!element.files || !element.files[0]) {
      return;
    }
    var error = this.profileImageIsValid(element.files[0]);
    if (error) {
      this.notificationService.fail(error);
      return;
    }

    this.seriesCoverImageEditableIsDisplayed = false;
    this.hasSeriesCoverImageChanged = true;
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;

    this.thumbnail1IsSelected = false;
    this.thumbnail2IsSelected = false;
    this.thumbnail3IsSelected = false;
    this.thumbnail4IsSelected = false;
    this.thumbnail5IsSelected = false;
    this.thumbnail6IsSelected = false;

    this.selectedThumbnailData = image;
    
    // this.formScroll.directiveRef.scrollToBottom(0, 300);
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
    this.imageInputCover.nativeElement.value = '';
    this.seriesCoverImageEditableIsDisplayed = true;
    this.hasSeriesCoverImageChanged = false;

    this.selectedThumbnailData = '';
  }

  public chooseThumbnail(propName: string, dataPropName: string): void {
    if (this.croppedImage) {
      this.removeImage();
    }

    this.thumbnail1IsSelected = false;
    this.thumbnail2IsSelected = false;
    this.thumbnail3IsSelected = false;
    this.thumbnail4IsSelected = false;
    this.thumbnail5IsSelected = false;
    this.thumbnail6IsSelected = false;

    this[propName] = true;
    this.selectedThumbnailData = this[dataPropName];
    
    this.formScroll.directiveRef.scrollToBottom(0, 300);
  }

  public goToCreateSeries(): void {
    this.utilsService.navigateInSlider('/account/create-series');
  }

}
