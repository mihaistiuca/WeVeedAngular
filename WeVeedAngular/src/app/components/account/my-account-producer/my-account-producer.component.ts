import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserBasicInfoDto } from '../../../generated-models/UserBasicInfoDto';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { DataService } from '../../../services/data/data.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';
import { AwsService } from '../../../services/aws/aws.service';
import { IsProducerNameUniqueInput } from '../../../generated-models/IsProducerNameUniqueInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { IsLoggedProducerNameUniqueInput } from '../../../generated-models/IsLoggedProducerNameUniqueInput';
import { ProducerUpdateInfoInput } from '../../../generated-models/ProducerUpdateInfoInput';
import { UtilsService } from '../../../services/utils/utils.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-account-producer',
  templateUrl: './my-account-producer.component.html',
  styleUrls: ['./my-account-producer.component.css'],
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
export class MyAccountProducerComponent implements OnInit, OnDestroy {

  public userProfileImageUrl: string;
  public userBasicInfo: UserBasicInfoDto;

  public userInfoForm: FormGroup;

  public panelOpenState1: boolean = false;
  public panelOpenState2: boolean = false;
  public panelOpenState3: boolean = false;

  public isInUserEditMode: boolean = false;

  public hasUserProfileImageChanged: boolean = false;
  public newProfileImageSrc: string;
  public userProfileImageEditableIsDisplayed: boolean = true;
  private userImageAwsKey: string;

  public isUserFormSubmitting: boolean = false;
  private producerTimeout: any;
  public isProducerNameUniqueRequestLoading: boolean = false;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';

  public currentUserBasicInfoSubscription: Subscription;

  @ViewChild('imageInputUser') imageInputUser;

  public validImageTypes = ["image/jpeg", "image/png"];

  constructor(private fb: FormBuilder, public authService: AuthService, private dataService: DataService,
    private userService: UserService, private notificationService: NotificationService,
    private awsService: AwsService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      if(value == null) {
        return;
      }

      this.userBasicInfo = value;
      this.userProfileImageUrl = value.profileImageUrl;

      this.panelOpenState3 = true;
      //this.panelOpenState1 = true;

      this.initForms();
    });
  }

  ngOnDestroy() {
    this.currentUserBasicInfoSubscription.unsubscribe();
  }

  private initForms(): void {
    this.userInfoForm = this.fb.group(
      {
        firstName: [this.userBasicInfo.firstName, [ Validators.required, Validators.maxLength(50) ] ],
        lastName: [this.userBasicInfo.lastName, [ Validators.required, Validators.maxLength(50) ] ],
        producerName: [
          this.userBasicInfo.producerName,
          [ Validators.required, Validators.maxLength(50) ],
          this.isProducerNameUnique.bind(this)
        ],
        producerDescription: [this.userBasicInfo.producerDescription, [ Validators.required, Validators.maxLength(500) ]],
        emailContact: [this.userBasicInfo.emailContact, [ Validators.maxLength(500) ]],
        facebookContactUrl: [this.userBasicInfo.facebookContactUrl, [ Validators.maxLength(500) ]],
        instaContactUrl: [this.userBasicInfo.instaContactUrl, [ Validators.maxLength(500) ]]
      }
    );
  }

  private isProducerNameUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      clearTimeout(this.producerTimeout);
      this.isProducerNameUniqueRequestLoading = true;

      this.producerTimeout = setTimeout(() => {
        this.userService.isLoggedProducerNameUnique({producerName: control.value} as IsLoggedProducerNameUniqueInput).subscribe((data: BaseResponse) => {
          this.isProducerNameUniqueRequestLoading = false;
          if(data.status == 422) {
            resolve({ 'isProducerNameUnique': true });   
          }
          else {
            resolve(null);
          }
        }, () => { 
          this.isProducerNameUniqueRequestLoading = false;
          resolve(null);
        });
      }, 500);
    });

    return q;
  }

  public changeUserProfile(): void {
    this.isInUserEditMode = true;
  }

  public cancelUserChange(): void {
    this.isInUserEditMode = false;
    this.croppedImage = '';
    this.imageChangedEvent = '';
    this.userProfileImageEditableIsDisplayed = true;
    this.hasUserProfileImageChanged = false;
  }

  public submitUserInfoForm(): void {
    
    if(!this.userInfoForm.valid) {
      Object.keys(this.userInfoForm.controls).forEach(field => {
        const control = this.userInfoForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isUserFormSubmitting = true;
    var self = this;

    if (this.hasUserProfileImageChanged) {
      this.userImageAwsKey = this.utilsService.generateRandomString(true);
      this.awsService.uploadBinaryFile(this.croppedImage, this.userImageAwsKey, 'weveed-profileimgs', function(err, data) {
        if (err) {
          self.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          self.isUserFormSubmitting = false;
        }
        else {
          self.newProfileImageSrc = data.Location;
          self.sendUserInfoToServer();
        }
      });
    }
    else {
      this.sendUserInfoToServer();
    }
  }

  public sendUserInfoToServer(): void {
    let profileImageUrl: string = null;
    if (this.hasUserProfileImageChanged) {
      profileImageUrl = this.newProfileImageSrc;
    }

    let input: ProducerUpdateInfoInput = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      hasProfileImageChanged: this.hasUserProfileImageChanged,
      profileImageUrl: profileImageUrl,
      producerName: this.producerName.value,
      producerDescription: this.producerDescription.value,
      emailContact: this.emailContact.value,
      facebookContactUrl: this.facebookContactUrl.value,
      instaContactUrl: this.instaContactUrl.value
    };

    this.userService.updateProducerInfo(input)
      .subscribe(
          (data: BaseResponse) => {
            this.isUserFormSubmitting = false;
            
            if (data.status == 200) {
              this.userBasicInfo.firstName = this.firstName.value;
              this.userBasicInfo.lastName = this.lastName.value;
              this.userBasicInfo.producerName = this.producerName.value;
              this.userBasicInfo.producerDescription = this.producerDescription.value;
              this.userBasicInfo.emailContact = this.emailContact.value;
              this.userBasicInfo.facebookContactUrl = this.facebookContactUrl.value;
              this.userBasicInfo.instaContactUrl = this.instaContactUrl.value;

              if (this.hasUserProfileImageChanged) {
                this.userBasicInfo.profileImageUrl = this.newProfileImageSrc;
              }
              this.dataService.changeUserBasicInfo(this.userBasicInfo);

              this.notificationService.success('Informatiile au fost modificate cu succes');

              this.isInUserEditMode = false;
              this.newProfileImageSrc = null;
              this.hasUserProfileImageChanged = false;
              this.userProfileImageEditableIsDisplayed = true;
              
              this.croppedImage = '';
              this.imageChangedEvent = '';
            }
            else {
              this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
            }
          },
          error => {
            this.isUserFormSubmitting = false;
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
      );
  }

  public keyDownFunctionOnForm(event) {
    if (event.srcElement.classList.contains("prevent-enter-submit")) {
      return;
    }
    if(event.keyCode == 13) {
      this.submitUserInfoForm();
    }
  }

  public get firstName() {
    return this.userInfoForm.get('firstName') as FormControl;
  }

  public get lastName() {
    return this.userInfoForm.get('lastName') as FormControl;
  }

  public get producerName() {
    return this.userInfoForm.get('producerName') as FormControl;
  }

  public get producerDescription() {
    return this.userInfoForm.get('producerDescription') as FormControl;
  }

  public get emailContact() {
    return this.userInfoForm.get('emailContact') as FormControl;
  }

  public get facebookContactUrl() {
    return this.userInfoForm.get('facebookContactUrl') as FormControl;
  }

  public get instaContactUrl() {
    return this.userInfoForm.get('instaContactUrl') as FormControl;
  }
  
  fileChangeEvent(event: any): void {
    let element = this.imageInputUser.nativeElement;
    if(!element.files || !element.files[0]) {
      return;
    }
    var error = this.profileImageIsValid(element.files[0]);
    if (error) {
      this.notificationService.fail(error);
      return;
    }

    this.userProfileImageEditableIsDisplayed = false;
    this.hasUserProfileImageChanged = true;
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
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

}
