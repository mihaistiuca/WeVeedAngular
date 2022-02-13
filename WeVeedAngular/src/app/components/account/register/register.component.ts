import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, Input , Inject} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { IsEmailUniqueInput } from '../../../generated-models/IsEmailUniqueInput';
import { PasswordMatchValidation } from '../../../validators/PasswordMatchValidator';
import { IsProducerNameUniqueInput } from '../../../generated-models/IsProducerNameUniqueInput';
import { UserRegisterInput } from '../../../generated-models/UserRegisterInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { NotificationService } from '../../../services/notification/notification.service';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data/data.service';


// import { AuthService as SocialAuthService } from 'angular2-social-login';
import {
  AuthService as SocialAuthService,
  FacebookLoginProvider
} from 'angular-6-social-login-with-first-name-last-name';

import { UserVerifyRegisterFacebookInput } from '../../../generated-models/UserVerifyRegisterFacebookInput';
import { UserVerifyFacebookRegisterDto } from '../../../generated-models/UserVerifyFacebookRegisterDto';
import { UserFBRegisterInput } from '../../../generated-models/UserFBRegisterInput';
import { UserBasicInfoDto } from '../../../generated-models/UserBasicInfoDto';
import { AuthService } from '../../../services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent implements OnInit {

  @Input() isOpenFromSidebar: boolean = false;

  public firstStepVisible: boolean = true;
  public secondStepVisible: boolean = false;
  public thirdStepVisible: boolean = false;

  public selectedUserType: string;
  
  private timeout: any;
  private producerTimeout: any;
  public isEmailUniqueRequestLoading: boolean = false;
  public isProducerNameUniqueRequestLoading: boolean = false;

  public shouldAcceptTermsBeAcceptedForUser: boolean = false;
  public shouldAcceptTermsBeAcceptedForProducer: boolean = false;
  public acceptTermsIsAccepted: boolean = false;

  public acceptTermsForUser: boolean = false;

  public isSubmitting: boolean = false;
  public isSubmittingFacebook: boolean = false;

  public isLoginWithFBChosen: boolean = false;
  public facebookUserId: string;
  public facebookToken: string;
  public facebookEmail: string;
  public facebookName: string;
  public facebookFirstName: string;
  public facebookLastName: string;
  public facebookImage: string;

  public lsIsLoginWithFBChosen: boolean = false;
  public lsFacebookUserId: string;
  public lsFacebookToken: string;
  public lsFacebookEmail: string;
  public lsFacebookName: string;
  public lsFacebookFirstName: string;
  public lsFacebookLastName: string;
  public lsFacebookImage: string;
  
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private fb: FormBuilder, private userService: UserService, private socialAuthService: SocialAuthService,
  // constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private fb: FormBuilder, private userService: UserService, 
    private notificationService: NotificationService, private router: Router, private authService: AuthService, private utilsService: UtilsService,
    private dataService: DataService) { }

  ngOnInit() {
    this.lsIsLoginWithFBChosen = this.localStorage.getItem('userTriedLoginWithFBFromLogin') == 'true';
    if (this.lsIsLoginWithFBChosen) {

      this.facebookUserId = this.localStorage.getItem('facebookUserId');
      this.facebookToken = this.localStorage.getItem('facebookToken');

      this.facebookName = this.localStorage.getItem('facebookName');
      this.facebookFirstName = this.localStorage.getItem('facebookFirstName');
      this.facebookLastName = this.localStorage.getItem('facebookLastName');
      this.facebookImage = this.localStorage.getItem('facebookImage');

      this.firstStepVisible = false;
      this.isLoginWithFBChosen = true;
      this.secondStepVisible = true;

      this.localStorage.removeItem('userTriedLoginWithFBFromLogin');
      this.localStorage.removeItem('facebookUserId');
      this.localStorage.removeItem('facebookToken');
      this.localStorage.removeItem('facebookName');
      this.localStorage.removeItem('facebookFirstName');
      this.localStorage.removeItem('facebookLastName');
      this.localStorage.removeItem('facebookImage');
    }
  }

  public firstStepForm = this.fb.group(
    {
      firstName: ['', [ Validators.required, Validators.maxLength(50) ] ],
      lastName: ['', [ Validators.required, Validators.maxLength(50) ] ],
      email: [
        '', 
        [ Validators.required, Validators.maxLength(256), Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/) ],
        this.isEmailUnique.bind(this)
      ],
      password: ['', [ Validators.required, Validators.maxLength(32), Validators.minLength(8) ]],
      confirmPassword: ['', [ Validators.required, Validators.maxLength(32), Validators.minLength(8) ]]
    }, {
      validator: PasswordMatchValidation.MatchPassword
    }
  );

  public secondStepForm = this.fb.group(
    {
      producerName: [
        '',
        [ Validators.required, Validators.maxLength(50) ],
        this.isProducerNameUnique.bind(this)
      ],
      acceptTerms: [
        false,
        [ Validators.pattern('true') ]
      ]
    }
  )

  private isEmailUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      clearTimeout(this.timeout);
      this.isEmailUniqueRequestLoading = true;

      this.timeout = setTimeout(() => {
        this.userService.isEmailUnique({email: control.value} as IsEmailUniqueInput).subscribe((data: BaseResponse) => {
          this.isEmailUniqueRequestLoading = false;
          if(data.status == 422) {
            resolve({ 'isEmailUnique': true });   
          }
          else {
            resolve(null);
          }
        }, () => { 
          this.isEmailUniqueRequestLoading = false;
          resolve(null);
        });
      }, 500);
    });

    return q;
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

  public doFirstStep(): void {

    if(this.firstStepForm.valid){
      this.firstStepVisible = false;
      this.secondStepVisible = true;
    }
    else {
      Object.keys(this.firstStepForm.controls).forEach(field => {
        const control = this.firstStepForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  public keyDownFunctionOnForm(event) {
    if(event.keyCode == 13) {
      this.doFirstStep();
    }
  }

  public keyDownFunctionOnSecondForm(event) {
    if(event.keyCode == 13) {
      this.doThirdStep();
    }
  }
  
  public backToStep1(): void {
    this.secondStepVisible = false;
    this.firstStepVisible = true;
    this.isLoginWithFBChosen = false;
  }

  public doSecondStep(userType: string): void {
    this.secondStepVisible = false;
    this.thirdStepVisible = true;

    this.selectedUserType = userType;
  }
  
  public backToStep2(): void {
    this.thirdStepVisible = false;
    this.secondStepVisible = true;
  }

  public doThirdStep(): void {

    if (this.selectedUserType == 'user') {
      this.shouldAcceptTermsBeAcceptedForUser = true;
      if(this.acceptTermsForUser) {
        this.submitRegisterForUser();
      }
      else {
        return;
      }
    }
    else if (this.selectedUserType == 'producer') {
      this.shouldAcceptTermsBeAcceptedForProducer = true;
      if(!this.secondStepForm.valid) {

        Object.keys(this.secondStepForm.controls).forEach(field => {
          const control = this.secondStepForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
  
        if (!this.acceptTerms.value) {
          this.acceptTermsIsAccepted = false;
        }
        else {
          this.acceptTermsIsAccepted = true;
        }
        
        return;
      }
  
      this.submitRegisterForProducer();
    }
  }

  public submitRegisterForUser(): void {
    if (this.isLoginWithFBChosen) {
      this.submitRegisterForUserFacebook();
      return;
    }

    if (!this.firstStepForm.valid) {
      this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
      return;
    }
    
    let input: UserRegisterInput = {
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      password: this.password.value,
      producerName: null,
      userType: 'user'
    };

    this.isSubmitting = true;
    
    this.userService.register(input)
      .subscribe(
        (data: BaseResponse) => {
          this.isSubmitting = false;

          if (data.status == 200) {
            if (this.isOpenFromSidebar) {
              this.dataService.changeShowLoginInSidebar(true);
            }
            else {
              this.router.navigateByUrl('/login');
            }
            this.notificationService.success('Contul a fost creat cu succes. Dupa confirmarea acestuia, va puteti conecta.');
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
        },
        error => {
          this.isSubmitting = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      );
  }

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  public submitRegisterForUserFacebook(): void {
    
    let input: UserFBRegisterInput = {
      email: this.facebookEmail,
      firstName: this.facebookFirstName,
      lastName: this.facebookLastName,
      producerName: null,
      userType: 'user',
      facebookUserId: this.facebookUserId,
      fbToken: this.facebookToken,
      thumbnailUrl: this.facebookImage
    };

    this.isSubmitting = true;
    
    this.userService.registerWithFacebook(input)
      .subscribe(
        (data: BaseResponse<UserBasicInfoDto>) => {
          this.isSubmitting = false;
          if (data.status == 200) {
            
            this.authService.setToken(data.data.token);
            this.dataService.changeUserBasicInfo(data.data);

            this.notificationService.success('Bine ai venit in noul tau cont WeVeed!');
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
            return;
          }
        },
        error => {
          this.isSubmitting = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      );
  }

  public submitRegisterForProducer(): void {
    if (this.isLoginWithFBChosen) {
      this.submitRegisterForProducerFacebook();
      return;
    }

    if (!this.firstStepForm.valid || !this.secondStepForm.valid) {
      this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
      return;
    }

    let input: UserRegisterInput = {
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      password: this.password.value,
      producerName: this.producerName.value,
      userType: 'producer'
    };

    this.isSubmitting = true;

    this.userService.register(input)
      .subscribe(
        (data: BaseResponse) => {
          this.isSubmitting = false;

          if (data.status == 200) {
            if (this.isOpenFromSidebar) {
              this.dataService.changeShowLoginInSidebar(true);
            }
            else {
              this.router.navigateByUrl('/login');
            }
            this.notificationService.success('Contul a fost creat cu succes. Dupa confirmarea acestuia, va puteti conecta.');
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
        },
        error => {
          this.isSubmitting = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      );
  }

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  public submitRegisterForProducerFacebook(): void {
    
    let input: UserFBRegisterInput = {
      email: this.facebookEmail,
      firstName: this.facebookFirstName,
      lastName: this.facebookLastName,
      producerName: this.producerName.value,
      userType: 'producer',
      facebookUserId: this.facebookUserId,
      fbToken: this.facebookToken,
      thumbnailUrl: this.facebookImage
    };

    this.isSubmitting = true;
    
    this.userService.registerWithFacebook(input)
      .subscribe(
        (data: BaseResponse<UserBasicInfoDto>) => {
          this.isSubmitting = false;
          if (data.status == 200) {
            
            this.authService.setToken(data.data.token);
            this.dataService.changeUserBasicInfo(data.data);

            this.notificationService.success('Bine ai venit in noul tau cont WeVeed!');
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
            return;
          }
        },
        error => {
          this.isSubmitting = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      );
  }

  public goToLogin(): void {
    if (this.isOpenFromSidebar) {
      this.dataService.changeShowLoginInSidebar(true);
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }

  public get firstName() {
    return this.firstStepForm.get('firstName') as FormControl;
  }

  public get lastName() {
    return this.firstStepForm.get('lastName') as FormControl;
  }

  public get email() {
    return this.firstStepForm.get('email') as FormControl;
  }

  public get password() {
    return this.firstStepForm.get('password') as FormControl;
  }

  public get confirmPassword() {
    return this.firstStepForm.get('confirmPassword') as FormControl;
  }

  public get producerName() {
    return this.secondStepForm.get('producerName') as FormControl;
  }

  public get acceptTerms() {
    return this.secondStepForm.get('acceptTerms') as FormControl;
  }

  public loginWithFB(): void {
    this.isSubmittingFacebook = true;

    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (data: any) => {

        this.facebookUserId = data.id;
        this.facebookToken = data.token;

        var input: UserVerifyRegisterFacebookInput = {
          fbToken: data.token,
          userId: data.id
        };

        this.userService.verifyRegisterWithFacebook(input)
          .subscribe(
            (requestData: BaseResponse<UserVerifyFacebookRegisterDto>) => {
              this.isSubmittingFacebook = false;
    
              if (requestData.status == 200 && requestData.data) {

                if (requestData.data.doesUserAlreadyExist) {
                  this.authService.setToken(requestData.data.loggedUser.token);
                  this.dataService.changeUserBasicInfo(requestData.data.loggedUser);
                  this.notificationService.success('Bine ai venit in contul tau WeVeed!');
                }
                else {
                  this.firstStepVisible = false;
                  this.isLoginWithFBChosen = true;
                  this.secondStepVisible = true;

                  this.facebookName = data.name;
                  this.facebookFirstName = data.first_name;
                  this.facebookLastName = data.last_name;
                  this.facebookImage = data.image;
                }
              }
              else {
                this.notificationService.fail('Ceva nu a mers bine. Incearca din nou')
              }
            },
            error => {
              this.isSubmittingFacebook = false;
              this.notificationService.fail('Ceva nu a mers bine. Incearca din nou')
            }
          );
      }
    )
  }

  public goToTermsAndConditions() {
    window.open("https://www.weveed.com/general/terms-and-conditions", "_blank");
  }

}
