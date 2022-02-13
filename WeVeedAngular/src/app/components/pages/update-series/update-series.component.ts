import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeriesService } from '../../../services/series/series.service';
import { AwsService } from '../../../services/aws/aws.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../../services/notification/notification.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { SeriesUpdateDto } from '../../../generated-models/SeriesUpdateDto';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { IsSeriesNameUniqueUpdateInput } from '../../../generated-models/IsSeriesNameUniqueUpdateInput';
import { SeriesUpdateInput } from '../../../generated-models/SeriesUpdateInput';

@Component({
  selector: 'app-update-series',
  templateUrl: './update-series.component.html',
  styleUrls: ['./update-series.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('200ms', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        style({transform: 'translateX(0)', opacity: 1}),
        animate('200ms', style({transform: 'translateX(-100%)', opacity: 0}))
      ])
    ])
  ]
})
export class UpdateSeriesComponent implements OnInit {
  
  private nameUniqueTimeout: any;
  public isNameUniqueRequestLoading: boolean = false;

  public hasSeriesCoverImageChanged: boolean = false;
  public newCoverImageSrc: string;
  public seriesCoverImageEditableIsDisplayed: boolean = true;
  private userImageAwsKey: string;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public isFormSubmitting: boolean = false;

  public seriesId: string;
  public seriesDto: SeriesUpdateDto;

  public updateSeriesForm: FormGroup;

  @ViewChild('seriesCoverUploader') seriesCoverUploader;
  @ViewChild('formScroll') formScroll: PerfectScrollbarComponent;

  public validImageTypes = ["image/jpeg", "image/png"];

  constructor(private dataService: DataService, private router: Router, private seriesService: SeriesService, private utilsService: UtilsService,
    private fb: FormBuilder, private activatedRoute: ActivatedRoute, private notificationService: NotificationService,
    private awsService: AwsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.seriesId = params['id'];
      if (!this.seriesId) {
        this.utilsService.navigateToSliderNotFound();
        return;
      }
      
      this.seriesService.getUpdateDtoById(this.seriesId)
        .subscribe(
          (response: BaseResponse<SeriesUpdateDto>) => {
            if (response.status == 200 && response.data) {
              this.seriesDto = response.data;
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

  public backToSeries(): void {
    this.utilsService.navigateInSlider('/series/' + this.seriesId);
  }

  private initForm(): void {
    this.updateSeriesForm = this.fb.group(
      {
        name: [
          this.seriesDto.name,
          [ Validators.required, Validators.maxLength(70) ],
          this.isSeriesNameUnique.bind(this)
        ],
        description: [this.seriesDto.description, [ Validators.required, Validators.maxLength(1000) ]],
        thumbnailUrl: [this.seriesDto.thumbnailUrl, [ Validators.maxLength(500) ] ]
      }
    );
  }

  public submitUpdateForm(): void {
    if(!this.updateSeriesForm.valid) {
      Object.keys(this.updateSeriesForm.controls).forEach(field => {
        const control = this.updateSeriesForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isFormSubmitting = true;
    var self = this;

    if (this.hasSeriesCoverImageChanged) {
      this.userImageAwsKey = this.utilsService.generateRandomString(true);
      this.awsService.uploadBinaryFile(this.croppedImage, this.userImageAwsKey, 'weveed-series-covers', function(err, data) {
        if (err) {
          self.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          self.isFormSubmitting = false;
        }
        else {
          self.newCoverImageSrc = data.Location;
          self.sendUpdateSeriesInfoToServer();
        }
      });
    }
    else {
      this.sendUpdateSeriesInfoToServer();
    }
  }

  public sendUpdateSeriesInfoToServer(): void {
    let coverImageUrl: string = null;
    if (this.hasSeriesCoverImageChanged) {
      coverImageUrl = this.newCoverImageSrc;
    }
    else {
      coverImageUrl = this.seriesDto.thumbnailUrl;
    }

    let input: SeriesUpdateInput = {
      id: this.seriesId,
      name: this.name.value,
      description: this.description.value,
      thumbnailUrl: coverImageUrl
    };

    this.seriesService.updateSeries(input)
      .subscribe(
        (data: BaseResponse) => {
          this.isFormSubmitting = false;

          if(data.status == 200) {
            this.utilsService.navigateInSlider('/series/' + this.seriesId);
            this.notificationService.success('Emisiunea "' + this.name.value + '" a fost modificata cu succes.');
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

  private isSeriesNameUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      clearTimeout(this.nameUniqueTimeout);
      this.isNameUniqueRequestLoading = true;

      this.nameUniqueTimeout = setTimeout(() => {
        this.seriesService.isSeriesNameUniqueUpdate({seriesId: this.seriesId, name: control.value} as IsSeriesNameUniqueUpdateInput).subscribe((data: BaseResponse) => {
          this.isNameUniqueRequestLoading = false;
          if(data.status == 422) {
            resolve({ 'isSeriesNameUnique': true });   
          }
          else {
            resolve(null);
          }
        }, () => { 
          this.isNameUniqueRequestLoading = false;
          resolve(null);
        });
      }, 500);
    });

    return q;
  }

  public get name() {
    return this.updateSeriesForm.get('name') as FormControl;
  }

  public get description() {
    return this.updateSeriesForm.get('description') as FormControl;
  }

  public get thumbnailUrl() {
    return this.updateSeriesForm.get('thumbnailUrl') as FormControl;
  }
  
  fileChangeEvent(event: any): void {
    let element = this.seriesCoverUploader.nativeElement;
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
    // it's not ok to scroll down on every move
    // this.formScroll.directiveRef.scrollToBottom(0, 300);

    const elem = document.createElement('canvas');
    elem.width = 570;
    elem.height = 240;
    const ctx = elem.getContext('2d');

    const newImg = new Image();
    let privateSelf = this;

    newImg.onload = function() {
      ctx.drawImage(newImg, 0, 0, 570, 240);
      ctx.canvas.toBlob((blob) => {
        var reader = new FileReader();

        reader.readAsDataURL(blob); 

        reader.onloadend = function() {
          privateSelf.croppedImage = reader.result;
        }
      }, 'image/jpeg', 0.5);
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
    this.seriesCoverUploader.nativeElement.value = '';
    this.seriesCoverImageEditableIsDisplayed = true;
    this.hasSeriesCoverImageChanged = false;
  }

}
