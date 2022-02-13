import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { DataService } from '../../../services/data/data.service';
import { UserBasicInfoDto } from '../../../generated-models/UserBasicInfoDto';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { UserUpdateInfoInput } from '../../../generated-models/UserUpdateInfoInput';
import { UserService } from '../../../services/user/user.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { NotificationService } from '../../../services/notification/notification.service';
import { AwsService } from '../../../services/aws/aws.service';
import { IsProducerNameUniqueInput } from '../../../generated-models/IsProducerNameUniqueInput';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserBecomeProducerInput } from '../../../generated-models/UserBecomeProducerInput';
import { Subscription } from 'rxjs';
import { UserBecomeProducerDto } from '../../../generated-models/UserBecomeProducerDto';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
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
export class MyAccountComponent implements OnInit, OnDestroy {

  public userType: string;
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

  public isUserBecomeProducerFormVisible: boolean = false;
  private producerTimeout: any;
  public isProducerNameUniqueRequestLoading: boolean = false;
  public isBecomeProducerFormSubmitting: boolean = false;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  
  public currentUserBasicInfoSubscription: Subscription;

  @ViewChild('imageInputUser') imageInputUser;

  public validImageTypes = ["image/jpeg", "image/png"];

  constructor(private fb: FormBuilder, public authService: AuthService, private dataService: DataService,
    private userService: UserService, private notificationService: NotificationService,
    private awsService: AwsService) { }

  ngOnInit() {
    this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      if(value == null) {
        // this.dataService.changeShowLoginInSidebar(true);
        return;
      }

      this.userBasicInfo = value;
      this.userType = value.userType;
      this.userProfileImageUrl = value.profileImageUrl;

      this.panelOpenState1 = true;

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
        lastName: [this.userBasicInfo.lastName, [ Validators.required, Validators.maxLength(50) ] ]
      }
    );
  }

  public becomeProducerForm = this.fb.group(
    {
      producerName: [
        '',
        [ Validators.required, Validators.maxLength(50) ],
        this.isProducerNameUnique.bind(this)
      ],
      producerDescription: ['', [ Validators.required, Validators.maxLength(500) ]]
    }
  );

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
      this.userImageAwsKey = this.generateRandomString(true);
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
    let input: UserUpdateInfoInput = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      hasProfileImageChanged: this.hasUserProfileImageChanged,
      profileImageUrl: profileImageUrl
    };

    this.userService.updateUserInfo(input)
      .subscribe(
          (data: BaseResponse) => {
            this.isUserFormSubmitting = false;
            
            if (data.status == 200) {
              this.userBasicInfo.firstName = this.firstName.value;
              this.userBasicInfo.lastName = this.lastName.value;
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

  private generateRandomString(isPng: boolean): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text + ".png";
  }

  // User select image, crop and upload region
  //------------------------------------------------------------//
  
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
  //------------------------------------------------------------//


  public openBecomeProducerForm(): void {
    this.isUserBecomeProducerFormVisible = true;
  }

  public cancelBecomeProducer(): void {
    this.isUserBecomeProducerFormVisible = false;
  }

  private isProducerNameUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      clearTimeout(this.producerTimeout);
      this.isProducerNameUniqueRequestLoading = true;

      this.producerTimeout = setTimeout(() => {
        this.userService.isProducerNameUnique({producerName: control.value} as IsProducerNameUniqueInput).subscribe((data: BaseResponse) => {
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

  public get producerName() {
    return this.becomeProducerForm.get('producerName') as FormControl;
  }

  public get producerDescription() {
    return this.becomeProducerForm.get('producerDescription') as FormControl;
  }

  public submitBecomeProducerForm(): void {
    
    if(!this.becomeProducerForm.valid) {
      Object.keys(this.becomeProducerForm.controls).forEach(field => {
        const control = this.becomeProducerForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isBecomeProducerFormSubmitting = true;

    let input: UserBecomeProducerInput = {
      producerName: this.producerName.value,
      producerDescription: this.producerDescription.value
    };

    this.userService.becomeProducer(input)
      .subscribe(
        (data: BaseResponse<UserBecomeProducerDto>) => {
          this.isBecomeProducerFormSubmitting = false;

          if (data.status == 500 || data.status == 422) {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
            return;
          }
          else if ( data.status == 200) {
            this.authService.setToken(data.data.token);
            
            this.userBasicInfo.userType = 'producer';
            this.userBasicInfo.producerName = this.producerName.value;
            this.userBasicInfo.producerDescription = this.producerDescription.value;

            this.dataService.changeUserBasicInfo(this.userBasicInfo);
          }
        }
      )
  }
}
