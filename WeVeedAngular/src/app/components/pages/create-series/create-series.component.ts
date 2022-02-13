import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { SeriesService } from '../../../services/series/series.service';
import { IsSeriesNameUniqueCreateInput } from '../../../generated-models/IsSeriesNameUniqueInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService } from '../../../services/notification/notification.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { SeriesCreateInput } from '../../../generated-models/SeriesCreateInput';
import { UtilsService } from '../../../services/utils/utils.service';
import { AwsService } from '../../../services/aws/aws.service';

@Component({
  selector: 'app-create-series',
  templateUrl: './create-series.component.html',
  styleUrls: ['./create-series.component.css'],
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
export class CreateSeriesComponent implements OnInit {
  
  private nameUniqueTimeout: any;
  public isNameUniqueRequestLoading: boolean = false;

  public hasSeriesCoverImageChanged: boolean = false;
  public newCoverImageSrc: string;
  public seriesCoverImageEditableIsDisplayed: boolean = true;
  private userImageAwsKey: string;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public isFormSubmitting: boolean = false;

  public showImageErrorMessage: boolean = false;

  @ViewChild('imageInputCover') imageInputCover;
  @ViewChild('formScroll') formScroll: PerfectScrollbarComponent;

  public validImageTypes = ["image/jpeg", "image/png"];

  constructor(private dataService: DataService, private router: Router, private seriesService: SeriesService, private utilsService: UtilsService,
    private fb: FormBuilder, private activatedRoute: ActivatedRoute, private notificationService: NotificationService,
    private awsService: AwsService) { }

  ngOnInit() {
  }

  public backToProfile(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  public submitCreateForm(): void {
    if(!this.createSeriesForm.valid) {
      Object.keys(this.createSeriesForm.controls).forEach(field => {
        const control = this.createSeriesForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    // validate the existance of an image 
    if (!this.hasSeriesCoverImageChanged) {
      this.notificationService.fail('Adaugati o imagine de coperta emisiunii create.');
      this.showImageErrorMessage = true;
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
          self.sendCreateSeriesInfoToServer();
        }
      });
    }
    else {
      this.sendCreateSeriesInfoToServer();
    }
  }

  public sendCreateSeriesInfoToServer(): void {
    let coverImageUrl: string = null;
    if (this.hasSeriesCoverImageChanged) {
      coverImageUrl = this.newCoverImageSrc;
    }

    let input: SeriesCreateInput = {
      name: this.name.value,
      description: this.description.value,
      category: this.category.value.value,
      thumbnailUrl: coverImageUrl
    };

    this.seriesService.createSeries(input)
      .subscribe(
        (data: BaseResponse) => {
          this.isFormSubmitting = false;

          if(data.status == 200) {
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
            this.notificationService.success('Emisiunea "' + this.name.value + '" a fost creata cu succes');
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
        },
        error => {
          this.isFormSubmitting = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      )
  }

  public keyDownFunctionOnForm(event) {
    if (event.srcElement.classList.contains("prevent-enter-submit")) {
      return;
    }
    if(event.keyCode == 13) {
      this.submitCreateForm();
    }
  }

  public createSeriesForm = this.fb.group(
    {
      name: [
        '', 
        [ Validators.required, Validators.maxLength(70) ],
        this.isSeriesNameUnique.bind(this)
      ],
      description: ['', [ Validators.required, Validators.maxLength(1000) ]],
      thumbnailUrl: ['', [ Validators.maxLength(500) ] ],
      category: ['', [ Validators.required ] ]
    }
  );

  private isSeriesNameUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      clearTimeout(this.nameUniqueTimeout);
      this.isNameUniqueRequestLoading = true;

      this.nameUniqueTimeout = setTimeout(() => {
        this.seriesService.isSeriesNameUniqueCreate({name: control.value} as IsSeriesNameUniqueCreateInput).subscribe((data: BaseResponse) => {
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
    return this.createSeriesForm.get('name') as FormControl;
  }

  public get description() {
    return this.createSeriesForm.get('description') as FormControl;
  }

  public get thumbnailUrl() {
    return this.createSeriesForm.get('thumbnailUrl') as FormControl;
  }

  public get category() {
    return this.createSeriesForm.get('category') as FormControl;
  }

  public categories = [
    { text: 'Divertisment', hint: 'Yey! Inca o emisiune care sa ne distreze!', value: 'entertainment' },
    { text: 'Educational', hint: 'Hai sa invatam lucruri utile!', value: 'educational' },
    { text: 'Stiri', hint: 'Asteptam de la tine cele mai noi informatii si reportaje!', value: 'news' },
    { text: 'Tech', hint: 'O idee excelenta! Exprima-ti pasiunea pentru tehnologie!', value: 'tech' },
    { text: 'Travel', hint: 'Calatoresti mult? Esti norocos! Impartaseste cu noi experientele tale!', value: 'travel' },
    { text: 'Beauty & Fashion', hint: 'Suntem siguri ca stilul tau va influenta pe multi dintre noi!', value: 'fashion' },
    { text: 'Sport', hint: 'Sportul si sanatatea merg mana in mana. Poti fi un model si o inspiratie pentru multi!', value: 'sport' },
    { text: 'Kids', hint: 'Povesteste-ne experientele tale.', value: 'kids' },
    { text: 'Cooking', hint: 'Esti tare in bucatarie? Arata-ti talentul tau pe WeVeed', value: 'cooking' },
    { text: 'Auto - Moto', hint: 'Masinile sunt pasiunea ta? Nu esti singurul. Experientele tale merita impartasite.', value: 'automoto' },
    { text: 'Gaming', hint: 'Jocurile pe calculatorsunt mai mult decat simple jocuri. O intreaga comunitate te asteapta!', value: 'gaming' },
    { text: 'Muzica', hint: 'Lumea merita sa auda muzica ta. Incanta-ne pe toti pe WeVeed.', value: 'music' },
    { text: 'Vlog', hint: 'Minunat, esti un om care are lucruri de spus, iar noi vrem sa te ascultam.', value: 'vlog' },
  ];
  
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
    this.showImageErrorMessage = false;
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
    this.imageInputCover.nativeElement.value = '';
    this.seriesCoverImageEditableIsDisplayed = true;
    this.hasSeriesCoverImageChanged = false;
  }
}
