import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { UserBasicInfoDto } from '../../../generated-models/UserBasicInfoDto';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { DataService } from '../../../services/data/data.service';
import { AuthService } from '../../../services/auth/auth.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-account-wrapper',
  templateUrl: './my-account-wrapper.component.html',
  styleUrls: ['./my-account-wrapper.component.css']
})
export class MyAccountWrapperComponent implements OnInit, OnDestroy {

  public showLogin: boolean;
  public currentUserBasicInfo: UserBasicInfoDto;
  public userType: string;

  public showResetPasswordSendEmail: boolean = false;

  public currentShowLoginInSidebarSubscription: Subscription;
  public currentUserBasicInfoSubscription: Subscription;

  public showResetPasswordSendEmailSubscript: Subscription;

  constructor(private router: Router, private userService: UserService,
    public authService: AuthService, private dataService: DataService) { }

  ngOnInit() {
    this.currentShowLoginInSidebarSubscription = this.dataService.currentShowLoginInSidebar.subscribe((value: boolean) => {
      this.showLogin = value;
    });

    this.showResetPasswordSendEmailSubscript = this.dataService.showResetPasswordSendEmail.subscribe((value: boolean) => {
      this.showResetPasswordSendEmail = value;
    });

    this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      
      this.currentUserBasicInfo = value;

      if (!value) {
        this.dataService.changeShowLoginInSidebar(true);
        this.authService.logout();
        return;
      }

      if (value) {
        this.userType = value.userType;
      }
    });
  }

  ngOnDestroy() {
    this.currentShowLoginInSidebarSubscription.unsubscribe();
    this.currentUserBasicInfoSubscription.unsubscribe();
    this.showResetPasswordSendEmailSubscript.unsubscribe();
  }
  
  scrollHandler(event) {
    let distanceToBottom: number = Infinity;
    if (event && event.target) {
      distanceToBottom = event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight;
      this.dataService.changeScrollToBottomDistance(distanceToBottom);
    }
  }

}
