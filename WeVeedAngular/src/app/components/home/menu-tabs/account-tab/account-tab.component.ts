import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { DataService } from '../../../../services/data/data.service';
import { UserBasicInfoDto } from '../../../../generated-models/UserBasicInfoDto';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ValidateProducerByAdminInput } from '../../../../generated-models/ValidateProducerByAdminInput';
import { BaseResponse } from 'src/app/basic-models/BaseResponse';
import { NotificationService } from '../../../../services/notification/notification.service';
import { MatDialog } from '@angular/material';
import { DialogProducerConditionsComponent } from '../../../reusable/dialog-producer-conditions/dialog-producer-conditions.component';

@Component({
  selector: 'app-account-tab',
  templateUrl: './account-tab.component.html',
  styleUrls: ['./account-tab.component.css']
})
export class AccountTabComponent implements OnInit, OnDestroy {

  public showLogin: boolean;
  public currentUserBasicInfo: UserBasicInfoDto;
  public userType: string;
  public hideProfileForForm: boolean = false;
  public showCreateSeries: boolean = false;

  public currentShowLoginInSidebarSubscription: Subscription;
  public currentUserBasicInfoSubscription: Subscription;

  public producerIdToValidate: string;
  public showValidateButton: boolean = true;
  public checkBoxSendEmail: boolean = true;

  constructor(private router: Router, private userService: UserService, private utilsService: UtilsService, public dialog: MatDialog,
    public authService: AuthService, private dataService: DataService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.currentShowLoginInSidebarSubscription = this.dataService.currentShowLoginInSidebar.subscribe((value: boolean) => {
      this.showLogin = value;
    });
    this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      this.currentUserBasicInfo = value;
      if (value) {
        this.userType = value.userType;
      }
    });

    this.userService.getBasicInfoById()
      .subscribe(
          (data: BaseResponse<UserBasicInfoDto>) => {
            this.currentUserBasicInfo = data.data;
          },
          error => {
          }
      );
    
    setTimeout(() => {
      this.pingCurrentUserIfNotValidated();
    }, 20000);
  }
  

  pingCurrentUserIfNotValidated() {
    if (this.currentUserBasicInfo && !this.currentUserBasicInfo.isProducerValidatedByAdmin) {
      this.userService.getBasicInfoById()
      .subscribe(
          (data: BaseResponse<UserBasicInfoDto>) => {
            this.currentUserBasicInfo = data.data;
            if (this.currentUserBasicInfo.isProducerValidatedByAdmin) {
              this.notificationService.success('Profilul tau de producator a fost validat cu succes de catre administratorii platformei. De acum, productiile tale vor ajunge in canalele WeVeed si in pagina Descopera.', 22000);
            }
            else {
              let self = this;
  
              setTimeout(() => {
                self.pingCurrentUserIfNotValidated();
              }, 20000);
            }
          },
          error => {
          }
      );
    }
  }

  ngOnDestroy() {
    this.currentShowLoginInSidebarSubscription.unsubscribe();
    this.currentUserBasicInfoSubscription.unsubscribe();
  }

  public onChangeValidationInput(e: any): void {
    this.producerIdToValidate = e;
  }

  public clickValidate(): void {
    this.showValidateButton = false;
    this.userService.validateProducerByAdmin({producerId: this.producerIdToValidate, sendEmailToProducer: this.checkBoxSendEmail} as ValidateProducerByAdminInput)
      .subscribe((data: BaseResponse) => {
        this.showValidateButton = true;
        alert("PRODUCATOR VALIDAT CU SUCCES");
      }, () => { 
        this.showValidateButton = true;
        alert("CEVA NU A MERS BINE");
      });
  }

  onClickViewConditions() {
    this.dialog.open(DialogProducerConditionsComponent, {
      width: '600px'
    });
  }

  public goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  public goToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  public goToPolicies(): void {
    this.router.navigateByUrl('/policies');
  }

  public testLogin(): void {
    this.userService.gets();
  }

  public logout(): void {
    this.authService.logout();
    this.dataService.changeUserBasicInfo(null);
    this.utilsService.navigateInSlider('/account');
  }

  public goToTerms() {
    this.utilsService.navigateInSlider('/terms-and-conditions');
  }

  public goToAboutUs() {
    this.utilsService.navigateInSlider('/about-us');
  }

}
