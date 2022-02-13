import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../../constants/Constants';
import { UtilsService } from '../../../../services/utils/utils.service';
import { DataService } from '../../../../services/data/data.service';
import { UserBasicInfoDto } from '../../../../generated-models/UserBasicInfoDto';
import { MatDialog } from '@angular/material';
import { DialogNouserContentComponent } from '../../../../components/reusable/dialog-nouser-content/dialog-nouser-content.component';
import { ChannelService } from '../../../../services/channel/channel.service';
import { GetMyChannelVideoInput } from '../../../../generated-models/GetMyChannelVideoInput';
import { BaseResponse } from '../../../../basic-models/BaseResponse';
import { VideoWatchDto } from '../../../../generated-models/VideoWatchDto';
import { DialogMychannelErrorContentComponent } from '../../../../components/reusable/dialog-mychannel-error-content/dialog-mychannel-error-content.component';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router } from '@angular/router';
import { SliderInfo, ElementInfo } from '../../../reusable/images-slider/SliderInfo';

@Component({
  selector: 'app-channels-tab',
  templateUrl: './channels-tab.component.html',
  styleUrls: ['./channels-tab.component.css']
})
export class ChannelsTabComponent implements OnInit, OnDestroy {

  public channelsConfig: any;

  public userBasicInfo: UserBasicInfoDto;
  public currentUserBasicInfoSubscription: Subscription;
  
  public currentChannelName: string;
  public currentChannelNameSubscription: Subscription;

  public myChannelPlayingNowSubscription: Subscription;
  public areChannelsEpisodesLoading: boolean = true;
  public isChannelVideosLoading: boolean = true;
  public channelsEpisodesObj: any = null;
  
  public sliderVideosInfos: {} = [];

  constructor(private constants: Constants, private utilsService: UtilsService, private channelService: ChannelService, private notificationService: NotificationService,
      private dataService: DataService, public dialog: MatDialog, private router: Router) { 
    this.channelsConfig = constants.ChannelsConfig;
  }

  ngOnInit() {
    this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      this.userBasicInfo = value;
    });

    this.currentChannelNameSubscription = this.dataService.channelVideoPlayingNowItem.subscribe((value: string) => {
      this.currentChannelName = value;
    });

    this.myChannelPlayingNowSubscription = this.dataService.myChannelPlayingNowItem.subscribe((value: VideoWatchDto) => {
      if (value != null) {
        this.currentChannelName = 'Meu';
      }
    });

    this.channelService.get3EpisodesForEachChannel()
    .subscribe(
      (response: BaseResponse<any>) => {
        if (response.status == 200 && response.data) {
          this.channelsEpisodesObj = response.data;
          
          this.channelsEpisodesObj.forEach(elementChannelObj => {
            // item2
            let dataElements: ElementInfo[] = [];
            if (!elementChannelObj || !elementChannelObj.item2) {
              // this.sliderVideosInfos[elementChannelObj.item1] = null;
              
            }
            else {
              dataElements = elementChannelObj.item2.map(a=> ({
                id: a.id,
                name: a.title,
                description: null,
                imgSrc: a.thumbnailUrl,
                redirectUrl: '',
  
                season: a.season,
                episode: a.episode,
                parentSeriesName: a.seriesName,
                parentSeriesThumbnailUrl: a.seriesThumbnail,
                videoBelongsToCurrentUser: false,
  
                numberOfViews: a.numberOfViews,
                length: a.length,
                wasEncoded: true,
  
                videoCategory: elementChannelObj.item1
              } as ElementInfo));
  
              let localSliderVideoInfo = {
                isSeries: false,
                isVideo: true,
                elements: dataElements
              };
  
              this.sliderVideosInfos[elementChannelObj.item1] = localSliderVideoInfo;
            }

          });

          this.isChannelVideosLoading = false;
          this.areChannelsEpisodesLoading = false;
        }
        else {
          this.areChannelsEpisodesLoading = false;
          this.notificationService.fail('Ceva nu a mers bine.');
        }
      },
      error => {
        this.areChannelsEpisodesLoading = false;
        this.notificationService.fail('Ceva nu a mers bine.');
      }
    );
  }

  ngOnDestroy() {
    this.currentUserBasicInfoSubscription.unsubscribe();
  }

  public navigateInPlayerTo(channelName: string): void {
    if (this.currentChannelName == channelName) {
      let channelConfigObj = this.constants.ChannelsConfig.filter(a=>a.name == channelName)[0];
      this.notificationService.info('Canalul ' + channelConfigObj.roName.charAt(0).toUpperCase() + channelConfigObj.roName.slice(1) + ' este deja deschis in partea stanga.');
      return;
    }

    // this.utilsService.navigateInPlayer(channelName);
    // let privateSelf = this;
    // setTimeout(() => {
      // privateSelf.router.navigateByUrl('/' + channelName + '/playnow');
    // }, 200);
    this.dataService.changeWaitForThisChannelEventInPlayNow(channelName);
    setTimeout(() => {
      this.router.navigateByUrl('/' + channelName + '/playnow');  
    }, 20);
    
    // this.utilsService.navigateInSlider('/playnow');
  }

  public playMyChannel(): void {
    if (this.currentChannelName == 'Meu') {
      this.notificationService.info('Canalul Meu este deja deschis in partea stanga.');
      return;
    }

    if (!this.userBasicInfo) {
      this.dialog.open(DialogNouserContentComponent, {
        width: '400px'
      });

      return;
    }

    let lastEpisodeId = this.utilsService.getLastEpisodeInChannel('myChannel');
    let input: GetMyChannelVideoInput = {
      lastVideoId: lastEpisodeId
    };

    this.channelService.getMyChannelVideo(input)
    .subscribe(
      (response: BaseResponse<VideoWatchDto>) => {
        if (response.status == 200 && response.data) {
          this.dataService.changeWaitForThisChannelEventInPlayNow('mychannel');
          
          this.dataService.changeMyChannelPlayingNowVideo(response.data);
          // this.utilsService.navigateInPlayer('mychannel');

          setTimeout(() => {
            this.router.navigateByUrl('/mychannel/playnow');
          }, 20);
        }
        else if( response.status == 422) {
          if (response.generalErrors[0].startsWith('Nu urmaresti')) {
            this.dialog.open(DialogMychannelErrorContentComponent, {
              width: '400px',
              data: ['Trebuie sa urmaresti cel putin o emisiune!', response.generalErrors[0]]
            });
          }
          else {
            this.dialog.open(DialogMychannelErrorContentComponent, {
              width: '400px',
              data: ['Emisiunile urmarite nu contin episoade!', response.generalErrors[0]]
            });
          }
        }
        else {
          this.utilsService.navigateToSliderError();
        }
      },
      error => {
        this.utilsService.navigateToSliderError();
      }
    );
  }

}
