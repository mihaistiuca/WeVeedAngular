import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { ConfirmAccountInput } from '../../../generated-models/ConfirmAccountInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { NotificationService } from '../../../services/notification/notification.service';
import { AuthService } from '../../../services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-activation-page',
  templateUrl: './activation-page.component.html',
  styleUrls: ['./activation-page.component.css']
})
export class ActivationPageComponent implements OnInit {

  public code: string;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, public notificationService: NotificationService,
    private authService: AuthService, private dataService: DataService) { }

  ngOnInit() {
    this.authService.logout();

    this.route.params.subscribe(params => {
      this.code = params['tx'];
      if (!this.code) {

        let href = window.location.href;
        if (!href.includes('/actx/')) {
          this.router.navigateByUrl('');
          return;
        }

        this.code = href.substr(href.indexOf('/actx/') + 6);
      }

      let input: ConfirmAccountInput = {
        code: this.code
      };

      this.userService.confirmAccount(input)
        .subscribe(
          (data: BaseResponse) => {
  
            if (data.status == 200 && data.isSuccess) {
              this.router.navigateByUrl('general/account');
              this.notificationService.success('Contul tau a fost activat. Acum te poti conecta!');
              this.dataService.changeUserWasActivated(true);
            }
            else {
              this.router.navigateByUrl('general/account');
              this.notificationService.fail('Activarea contului a esuat. Incearca din nou.');
              this.dataService.changeUserWasActivated(true);
            }
          },
          error => {
            this.router.navigateByUrl('general/account');
            this.notificationService.fail('Activarea contului a esuat. Incearca din nou.');
            this.dataService.changeUserWasActivated(true);
          }
        )

    });
  }

}
