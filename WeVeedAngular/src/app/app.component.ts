import { isPlatformBrowser , DOCUMENT} from '@angular/common';
import { environment } from '../environments/environment';
import { Component, OnInit , Inject, PLATFORM_ID, OnDestroy} from '@angular/core';
import { UserService } from './services/user/user.service';
import { NotificationService } from './services/notification/notification.service';
import { Router } from '@angular/router';
import { DataService } from './services/data/data.service';
// import { AuthService } from './services/auth/auth.service';
import { BaseResponse } from './basic-models/BaseResponse';
import { UserBasicInfoDto } from './generated-models/UserBasicInfoDto';
import { UtilsService } from './services/utils/utils.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { AuthService } from '../app/services/auth/auth.service';
import { bool } from 'aws-sdk/clients/signer';
import { Subscription } from 'rxjs';
import { Gtag } from 'angular-gtag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public testLoading: boolean = true;
  public isWeb: boolean = false;
  public isMobile: boolean = false;
  public isTablet: boolean = false;
  public deviceInfo: DeviceInfo;
  public os: string;

  public isActivateUrl: boolean;

  public userWasActivatedSubscription: Subscription;

  public isResetPasswordUrlSubscription: Subscription;

  public userIsLoading: boolean = true;

  public isResetPasswordUrl: boolean = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: any, private userService: UserService, private authService: AuthService,
    private notificationService: NotificationService, private router: Router,
    private dataService: DataService, private utilsService: UtilsService,
    private deviceService: DeviceDetectorService, gtag: Gtag) { 
      router.events.subscribe((val) => {
        // see also 
    });
    }

  ngOnDestroy(): void {
    this.userWasActivatedSubscription.unsubscribe();
    this.isResetPasswordUrlSubscription.unsubscribe();
  }

  ngOnInit(): void {
    if (window.location.href.includes('/rstpwd/')) {
      this.isResetPasswordUrl = true;
    }

    // prevents any drag and drop in the page to open the file and closing the website 
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);

    this.userWasActivatedSubscription = this.dataService.userWasActivated.subscribe((value: boolean) => {
      if (value) {
        // if the user was activated, make the mobile page normal 
        this.isActivateUrl = false;
      }
    });

    this.isResetPasswordUrlSubscription = this.dataService.isResetPasswordUrl.subscribe((value: boolean) => {
      if (!value) {
        // if the user was activated, make the mobile page normal 
        this.isResetPasswordUrl = false;
      }
    });

    this.isWeb = this.deviceService.isDesktop();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.os = this.deviceInfo.os.toLowerCase();

    if (window.location.href.includes('/actx/')) {
      this.isActivateUrl = true;
    }

    if (!this.utilsService.getTest()) {
      this.userService.test()
        .subscribe(
          (data: BaseResponse<string>) => {
            this.utilsService.setTest(data.data);
            this.testLoading = false;
          },
          error => {
            this.testLoading = false;
          }
        );
    }
    else{
      this.testLoading = false;
    }

    if (this.authService.isAuthenticated()) {
      this.userService.getBasicInfoById()
        .subscribe(
            (data: BaseResponse<UserBasicInfoDto>) => {
              this.dataService.changeUserBasicInfo(data.data);
              this.userIsLoading = false;
            },
            error => {
              this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
              this.userIsLoading = false;
            }
        );
    }
    else {
      this.userIsLoading = false;
    }
  
    if (!isPlatformBrowser(this.platformId)) {
        let bases = this.document.getElementsByTagName('base');

        if (bases.length > 0) {
            bases[0].setAttribute('href', environment.baseHref);
        }
    }
}

}
