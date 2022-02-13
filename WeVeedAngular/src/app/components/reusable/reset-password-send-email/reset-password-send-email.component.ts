import { Component, OnInit, Input , Inject} from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification/notification.service';
import { DataService } from '../../../services/data/data.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ResetPasswordSendEmailInput } from '../../../generated-models/ResetPasswordSendEmailInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';

@Component({
  selector: 'app-reset-password-send-email',
  templateUrl: './reset-password-send-email.component.html',
  styleUrls: ['./reset-password-send-email.component.css']
})
export class ResetPasswordSendEmailComponent implements OnInit {

  public isSubmitting: boolean = false;

  public generalErrorList: string[] = [];

  constructor(private fb: FormBuilder, private userService: UserService,
    private notificationService: NotificationService, private router: Router,
    private authService: AuthService, private dataService: DataService) { }

  ngOnInit() {
  }

  public formSendEmail = this.fb.group(
    {
      email: [
        '', 
        [ Validators.required, Validators.maxLength(256), Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/) ]
      ]
    }
  );

  public keyDownFunctionOnForm(event) {
    if(event.keyCode == 13) {
      this.submitForm();
    }
  }

  public submitForm(): void {
    this.generalErrorList = [];

    if(!this.formSendEmail.valid) {
      Object.keys(this.formSendEmail.controls).forEach(field => {
        const control = this.formSendEmail.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isSubmitting = true;

    let input: ResetPasswordSendEmailInput = {
      email: this.email.value
    };

    this.userService.resetPasswordSendEmail(input)
      .subscribe(
        (data: BaseResponse) => {
          this.isSubmitting = false;

          if (data.status == 200 && data.isSuccess) {
            this.notificationService.success('Un email a fost trimis catre adresa ta de email. Urmeaza instructiunile pentru a recupera parola', 10000);
            this.dataService.changeShowResetPasswordSendEmail(false);
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

  public goToResetPasswordSendEmail(): void {
      this.dataService.changeShowResetPasswordSendEmail(false);
  }

  public get email() {
    return this.formSendEmail.get('email') as FormControl;
  }

}
