import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { VideoService } from '../../../../services/video/video.service';
import { BaseResponse } from '../../../../basic-models/BaseResponse';
import { VideoPlayingNowDto } from '../../../../generated-models/VideoPlayingNowDto';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../services/utils/utils.service';
import { ChannelService } from '../../../../services/channel/channel.service';
import { GetChannelPlayingNowVideoListInput } from '../../../../generated-models/GetChannelPlayingNowVideoListInput';
import { Constants } from '../../../../constants/Constants';
import { GetMyChannelPlayingNowVideoListInput } from '../../../../generated-models/GetMyChannelPlayingNowVideoListInput';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-playnow-tab',
  templateUrl: './playnow-tab.component.html',
  styleUrls: ['./playnow-tab.component.css']
})
export class PlaynowTabComponent implements OnInit, OnDestroy {

  public singleVideoSubscription: Subscription;
  public isSingleVideoPlaying: boolean = false;
  public singleVideoId: string;
  public singleVideoInfo: VideoPlayingNowDto;
  public isSingleVideoLoading: boolean = false;

  public channelSubscription: Subscription;
  public channelVideoSubscription: Subscription;
  public isChannelVideoPlaying: boolean = false;
  public channelPlaying: string;
  public channel: string;
  public channelDisplay: string;
  public channelVideoId: string;
  public channelVideoInfo: VideoPlayingNowDto;
  public isChannelCurrentVideoLoading: boolean = false;
  public isChannelVideosLoading: boolean = false;

  public channelNextVideosInfo: VideoPlayingNowDto[];
  public isChannelNextVideosLoading: boolean = false;

  public waitForChannelSubscription: Subscription;
  public waitedChannelValue: string;
  public channelVideoIdForNextVideoPlayItemSubscription: Subscription;

  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(private dataService: DataService, private videoService: VideoService, private utilsService: UtilsService, private channelService: ChannelService,
    private constants: Constants) { 
  }
  
  ngOnInit() {
    this.channelVideoIdForNextVideoPlayItemSubscription = this.dataService.channelVideoIdForNextVideoPlayItem.subscribe((videoId: string) => {
      this.perfectScroll.directiveRef.scrollToTop();
    });

    this.waitForChannelSubscription = this.dataService.waitForThisChannelEventInPlayNow.subscribe((value: string) => {
      if (value) {
        this.waitedChannelValue = value;
      }
    });

    this.singleVideoSubscription = this.dataService.videoPlayingNowItem.subscribe((value: string) => {
      if (value) {
        this.isChannelVideoPlaying = false;
        this.channelPlaying = null;
        this.channel = null;
        this.channelDisplay = null;
  
        this.singleVideoId = value;
        this.isSingleVideoPlaying = true;

        this.initSingleVideoInfo();
      }
    });

    // CHANNEL VIDEO ID change subscribe 
    this.channelVideoSubscription = this.dataService.channelVideoIdPlayNow.subscribe((value: string) => {
      if (value) {
        this.isSingleVideoPlaying = false;
        this.singleVideoId = null;
        this.singleVideoInfo = null;
  
        this.channelVideoId = value;
        this.isChannelVideoPlaying = true;

        this.initChannelVideoInfo();
      }
    });

    // CHANNEL NAME change subscribe 
    // asta are nevoie de celalalt 
    this.channelSubscription = this.dataService.channelVideoPlayingDiffNowItem.subscribe((value: string) => {
      if (value) {
        if (this.waitedChannelValue && this.waitedChannelValue != value) {
          return;
        }
        else if (this.waitedChannelValue && this.waitedChannelValue == value) {
          this.waitedChannelValue = null;
        }

        this.isSingleVideoPlaying = false;
        this.singleVideoId = null;
        this.singleVideoInfo = null;
  
        this.channel = value;
        this.channelDisplay = this.constants.channelNamingMapping[this.channel];
        this.isChannelVideoPlaying = true;

        if (this.channel == this.constants.MyChannel) {
          this.initMyChannelNextVideosInfo();
        }
        else {
          this.initChannelNextVideosInfo();
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.singleVideoSubscription.unsubscribe();
    this.channelSubscription.unsubscribe();
    this.channelVideoSubscription.unsubscribe();
    this.waitForChannelSubscription.unsubscribe();
    this.channelVideoIdForNextVideoPlayItemSubscription.unsubscribe();
  }

  public initSingleVideoInfo(): void {
    this.isChannelCurrentVideoLoading = true;

    this.videoService.getPlayingNowById(this.singleVideoId)
    .subscribe(
      (response: BaseResponse<VideoPlayingNowDto>) => {
        if (response.status == 200 && response.data) {
          this.singleVideoInfo = response.data;
          this.isSingleVideoLoading = false;
        }
        else {
          this.isSingleVideoLoading = false;
          // this.utilsService.navigateToSliderError();
        }
      },
      error => {
          this.isSingleVideoLoading = false;
          // this.utilsService.navigateToSliderError();
      }
    );
  }

  public initChannelVideoInfo(): void {
    this.isChannelVideosLoading = true;
    this.channelVideoInfo = null;

    this.videoService.getPlayingNowById(this.channelVideoId)
    .subscribe(
      (response: BaseResponse<VideoPlayingNowDto>) => {
        if (response.status == 200 && response.data) {
          this.channelVideoInfo = response.data;
          this.isChannelVideosLoading = false;;
        }
        else {
          this.isChannelVideosLoading = false;
          // this.utilsService.navigateToSliderError();
        }
      },
      error => {
          this.isChannelVideosLoading = false;
          // this.utilsService.navigateToSliderError();
      }
    );
  }

  public initChannelNextVideosInfo(): void {
    this.isChannelNextVideosLoading = true;
    this.channelNextVideosInfo = null;

    let input: GetChannelPlayingNowVideoListInput = {
      channelName: this.channel,
      playingNowVideoId: this.channelVideoId
    };

    this.channelService.getPlayingNowVideoList(input)
     .subscribe(
       (response: BaseResponse<VideoPlayingNowDto[]>) => {
        if (response.status == 200 && response.data) {
          this.channelNextVideosInfo = response.data;
          this.isChannelNextVideosLoading = false;
        }
        else {
          this.isChannelNextVideosLoading = false;
        }
       },
       error => {
         this.isChannelNextVideosLoading = false;
       }
     )
  }

  public initMyChannelNextVideosInfo(): void {
    this.isChannelNextVideosLoading = true;
    this.channelNextVideosInfo = null;

    let input: GetMyChannelPlayingNowVideoListInput = {
      playingNowVideoId: this.channelVideoId
    };

    this.channelService.getMyChannelPlayingNowVideoList(input)
     .subscribe(
       (response: BaseResponse<VideoPlayingNowDto[]>) => {
        if (response.status == 200 && response.data) {
          this.channelNextVideosInfo = response.data;
          this.isChannelNextVideosLoading = false;
        }
        else {
          this.isChannelNextVideosLoading = false;
        }
       },
       error => {
         this.isChannelNextVideosLoading = false;
       }
     )
  }

  public goToProducer(producerId): void {
    this.utilsService.navigateInSlider('/producer/' + producerId);
  }

}
