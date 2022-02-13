import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, Input , Inject} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '../../../services/notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { DataService } from '../../../services/data/data.service';
import { PasswordMatchValidation } from '../../../validators/PasswordMatchValidator';
import { ResetPasswordInput } from '../../../generated-models/ResetPasswordInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public isSubmitting: boolean = false;

  public generalErrorList: string[] = [];

  public resetToken: string = null;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private fb: FormBuilder, private userService: UserService, private activatedRoute: ActivatedRoute,
  // constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private fb: FormBuilder, private userService: UserService, 
    private notificationService: NotificationService, private router: Router, private authService: AuthService, private utilsService: UtilsService,
    private dataService: DataService) { }

  ngOnInit() {
    let href = window.location.href;
    this.resetToken = href.substr(href.indexOf('/rstpwd/') + 8);
  }
  
  public formReset = this.fb.group(
    {
      password: ['', [ Validators.required, Validators.maxLength(32), Validators.minLength(8) ]],
      confirmPassword: ['', [ Validators.required, Validators.maxLength(32), Validators.minLength(8) ]]
    }, {
      validator: PasswordMatchValidation.MatchPassword
    }
  );

  public submitForm(): void {
    this.generalErrorList = [];

    if(!this.formReset.valid) {
      Object.keys(this.formReset.controls).forEach(field => {
        const control = this.formReset.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isSubmitting = true;

    let input: ResetPasswordInput = {
      resetToken: this.resetToken,
      newPassword: this.password.value
    };

    this.userService.resetPassword(input)
      .subscribe(
        (data: BaseResponse) => {
          this.isSubmitting = false;

          if (data.status == 200 && data.isSuccess) {
            this.router.navigateByUrl('/general/account');
            this.notificationService.success('Parola a fost modificata cu succes');
            this.dataService.changeIsResetPasswordUrl(false);
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
        },
        error => {
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      );
  }

  public keyDownFunctionOnForm(event) {
    if(event.keyCode == 13) {
      this.submitForm();
    }
  }

  public get confirmPassword() {
    return this.formReset.get('confirmPassword') as FormControl;
  }

  public get password() {
    return this.formReset.get('password') as FormControl;
  }

}
