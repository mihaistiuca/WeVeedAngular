import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { UserBasicInfoDto } from '../../../generated-models/UserBasicInfoDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public selectedTab: string = "channels";
  public userBasicInfo: UserBasicInfoDto = null;
  public userProfileImageUrl: string = null;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      if(value != null) {
        this.userBasicInfo = value;
        this.userProfileImageUrl = value.profileImageUrl;
      }
      else {
        this.userBasicInfo = null;
        this.userProfileImageUrl = null;
      }
    });
  }

  public selectFromMenu(selected: string): void {
    // this.selectedTab = selected;
    this.router.navigateByUrl(selected);
  }
  
  scrollHandler(event) {
    let distanceToBottom: number = Infinity;
    if (event && event.target) {
      distanceToBottom = event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight;
      this.dataService.changeScrollToBottomDistance(distanceToBottom);
    }
  }

}
