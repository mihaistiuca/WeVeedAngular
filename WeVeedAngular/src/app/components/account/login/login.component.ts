import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, Input , Inject} from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserLoginInput } from '../../../generated-models/UserLoginInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { UserAuthenticateDto } from '../../../generated-models/UserAuthenticateDto';
import { AuthService } from '../../../services/auth/auth.service';
import { DataService } from '../../../services/data/data.service';
import { UserBasicInfoDto } from '../../../generated-models/UserBasicInfoDto';
// import { AuthService as SocialAuthService } from 'angular2-social-login';
import {
  AuthService as SocialAuthService,
  FacebookLoginProvider
} from 'angular-6-social-login-with-first-name-last-name';
import { UserLoginWithFBInput } from '../../../generated-models/UserLoginWithFBInput';
import { UserVerifyFacebookRegisterDto } from '../../../generated-models/UserVerifyFacebookRegisterDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() isOpenFromSidebar: boolean = false;

  public isSubmitting: boolean = false;
  public isSubmittingFacebook: boolean = false;

  public isLoginWithFBChosen: boolean = false;
  public facebookUserId: string;
  public facebookToken: string;

  public generalErrorList: string[] = [];

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private fb: FormBuilder, private userService: UserService, private socialAuthService: SocialAuthService,
  // constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private fb: FormBuilder, private userService: UserService,
    private notificationService: NotificationService, private router: Router,
    private authService: AuthService, private dataService: DataService) { }

  ngOnInit() {
  }

  public loginForm = this.fb.group(
    {
      email: [
        '', 
        [ Validators.required, Validators.maxLength(256), Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/) ]
      ],
      password: ['', [ Validators.required, Validators.maxLength(32), Validators.minLength(8) ]],
    }
  );

  public keyDownFunctionOnForm(event) {
    if(event.keyCode == 13) {
      this.submitLoginForm();
    }
  }

  public submitLoginForm(): void {
    this.generalErrorList = [];

    if(!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach(field => {
        const control = this.loginForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isSubmitting = true;

    let input: UserLoginInput = {
      email: this.email.value,
      password: this.password.value
    };

    this.userService.login(input)
      .subscribe(
          (data: BaseResponse<UserBasicInfoDto>) => {
            this.isSubmitting = false;
            if (data.status == 401) {
              this.generalErrorList = data.generalErrors;
              return;
            }
            else if (data.status == 500 || data.status == 422 || !data.data || !data.data.token) {
              this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
              return;
            }
            else if ( data.status == 200) {
              this.authService.setToken(data.data.token);
              if(!this.isOpenFromSidebar) {
                this.router.navigateByUrl('/');
              }

              // var newUserData: UserBasicInfoDto = {
              //   email: data.data.email,
              //   firstName: data.data.firstName,
              //   lastName: data.data.lastName,
              //   producerName: data.data.producerName,
              //   profileImageUrl: data.data.profileImageUrl,
              //   userType: data.data.userType,
              //   producerDescription: data.data.producerDescription,
              //   emailContact: data.data.emailContact,
              //   facebookContactUrl: data.data.facebookContactUrl,
              //   instaContactUrl: data.data.instaContactUrl,
              //   seriesFollowed: []
              // };
              this.dataService.changeUserBasicInfo(data.data);
            }
          },
          error => {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
      );
  }

  public goToRegister(): void {
    if (this.isOpenFromSidebar) {
      this.dataService.changeShowLoginInSidebar(false);
    }
    else {
      this.router.navigateByUrl('/register');
    }
  }

  public goToResetPasswordSendEmail(): void {
    // if (this.isOpenFromSidebar) {
      this.dataService.changeShowResetPasswordSendEmail(true);
    // }
    // else {
    //   this.router.navigateByUrl('/register');
    // }
  }

  public get email() {
    return this.loginForm.get('email') as FormControl;
  }

  public get password() {
    return this.loginForm.get('password') as FormControl;
  }

  public loginWithFB(): void {
    this.isSubmittingFacebook = true;

    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (data: any) => {

        this.facebookUserId = data.id;
        this.facebookToken = data.token;

        var input: UserLoginWithFBInput = {
          fbToken: data.token,
          userId: data.id
        };

        this.userService.loginWithFacebook(input)
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
                  this.localStorage.setItem('userTriedLoginWithFBFromLogin', 'true');
                  this.localStorage.setItem('facebookUserId', data.id);
                  this.localStorage.setItem('facebookToken', data.token);
                  this.localStorage.setItem('facebookName', data.name);
                  this.localStorage.setItem('facebookFirstName', data.first_name);
                  this.localStorage.setItem('facebookLastName', data.last_name);
                  this.localStorage.setItem('facebookImage', data.image);
                  this.goToRegister();
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

}
