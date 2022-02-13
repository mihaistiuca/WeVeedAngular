import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { VideoWatchDto } from '../../../generated-models/VideoWatchDto';
import { ChannelService } from '../../../services/channel/channel.service';
import { DataService } from '../../../services/data/data.service';
import { Constants } from '../../../constants/Constants';
import { VideoService } from '../../../services/video/video.service';
import { UserService } from '../../../services/user/user.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { PingInput } from '../../../generated-models/PingInput';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { GetMyChannelVideoInput } from '../../../generated-models/GetMyChannelVideoInput';
import { NotificationService } from '../../../services/notification/notification.service';
import { GetMyChannelNextVideoInput } from '../../../generated-models/GetMyChannelNextVideoInput';
declare var videojs: any;

@Component({
  selector: 'app-my-channel',
  templateUrl: './my-channel.component.html',
  styleUrls: ['./my-channel.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(10, style({opacity:1})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(10, style({opacity:0})) 
      ])
    ])
  ]
})
export class MyChannelComponent implements OnInit, OnDestroy {

  public channelName: string = 'mychannel';
  public channelDisplayName: string = 'Meu';
  
  private videoJSplayer: any;
  private inactTimeout: number = 0;
  
  @ViewChild('videoPlayerId') videoPlayerId: any;
  public videoSrc: string;

  public videoId: string;

  public isVideoLargeScreen: boolean = false;

  public isResourceNotFound: boolean = false;
  public isSomethingWentWrong: boolean = false;
  public isRequestLoading: boolean = false;

  public videoWatchDto: VideoWatchDto;

  public isMouseOverVideo: boolean;

  public showPrevNextEp: boolean = false;
  public showPlayBtn: boolean = true;

  public myChannelPlayingNowItemSubscription: Subscription;
  public channelVideoIdForNextVideoPlayItemSubscription: Subscription;
  
  private numberOfSecondsForPreview: number = 5;
  private numberOfSecondsForPreviewBigVideo: number = 20;
  public bigVideoLengthSeconds: number = 900;

  public playRemoveOverlayTimeout: any;
  public showOverlay: boolean = true;

  public timeout1: any;
  public timeout2: any;
  public timeout3: any;
  public timeout4: any;
  public timeout5: any;

  public timeoutFS1: any;
  public timeoutFS2: any;

  public globalRedirectClickHandler: any;

  constructor(private channelService: ChannelService, private dataService: DataService, private constants: Constants, private notificationService: NotificationService,
    private utilsService: UtilsService, private userService: UserService, private videoService: VideoService) { }

  ngOnDestroy() {
    this.myChannelPlayingNowItemSubscription.unsubscribe();
    this.channelVideoIdForNextVideoPlayItemSubscription.unsubscribe();
    document.getElementById('mainWrapper').onclick = null;

    this.removeVideoBeforeCreatingNew();
  }

  ngOnInit() {
    let thisSelf = this;
    document.getElementById('mainWrapper').onclick = function(e) {
      thisSelf.videoJSplayer.focus();
    }

    this.channelVideoIdForNextVideoPlayItemSubscription = this.dataService.channelVideoIdForNextVideoPlayItem.subscribe((videoId: string) => {
      if(videoId == null) {
        return;
      }
      
      this.isRequestLoading = true;

      // SUPER IMPORTANT 
      // Remove the video before creating e new one 
      this.removeVideoBeforeCreatingNew();

      this.videoService.getWatchDtoById(videoId)
      .subscribe(
        (response: BaseResponse<VideoWatchDto>) => {
          if (response.status == 200 && response.data) {
            this.dataService.changeMyChannelPlayingNowVideo(response.data);
          }
          else if( response.status == 500) {
            this.isSomethingWentWrong = true;
            this.showPlayBtn = false;
            this.videoWatchDto = null;
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
          else {
            this.isResourceNotFound = true;
            this.showPlayBtn = false;
            this.videoWatchDto = null;
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
        }),
        error => {
          this.isResourceNotFound = true;
          this.showPlayBtn = false;
          this.videoWatchDto = null;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
    });

    this.myChannelPlayingNowItemSubscription = this.dataService.myChannelPlayingNowItem.subscribe((video: VideoWatchDto) => {
      if (video == null) {
        return;
      }
      
      // SUPER IMPORTANT 
      // Remove the video before creating e new one 
      this.removeVideoBeforeCreatingNew();
      
      this.isRequestLoading = false;

      this.videoWatchDto = video;
      this.videoId = video.id;

      this.utilsService.saveLastEpisodeInChannel(this.channelName, this.videoId);

      let privateSelf = this;
      setTimeout(() => {
        privateSelf.dataService.changeChannelVideoIdPlayNow(privateSelf.videoId);
        privateSelf.dataService.changeChannelVideoPlayingNowDiffItem(privateSelf.channelName);
      }, 20);

      var self = this;

      this.anotherTest();

      setTimeout(() => {
        this.videoJSplayer = videojs(document.getElementById('videoPlayerId'), {inactivityTimeout: self.inactTimeout, playbackRates: [0.5, 1, 1.25, 1.5, 2]}, function() {
          var myPlayer = this;
          myPlayer.ready(function() {
            self.videoJSplayer.play();
          });

          myPlayer.on('ended', function() {
            self.goToNextVideo();
          });
        });

        this.dataService.changeShowLogo(false);

        this.timeout3 = setTimeout(() => {
          if (self.isVideoPlaying()) {
            self.videoJSplayer.userActive(false);
            self.showOverlay = false;
          }
        }, 2000);

        let volume = this.utilsService.getVolume();
        if (volume) {
          this.videoJSplayer.volume(volume);
        }

        this.videoJSplayer.on("volumechange", function () {
          let currentVolume = self.videoJSplayer.volume();
          self.utilsService.setVolume(currentVolume);
        });

        this.videoJSplayer.on("play", function () {
          self.showPlayBtn = false;
          clearTimeout(self.playRemoveOverlayTimeout);
  
          self.playRemoveOverlayTimeout = setTimeout(() => {
            // self.showOverlay = false;
          }, 2000);
        });

        this.videoJSplayer.on("pause", function () {
          self.showPlayBtn = true;
          self.showOverlay = true;
          clearTimeout(self.playRemoveOverlayTimeout);
          clearTimeout(self.timeout1);
          clearTimeout(self.timeout2);
          clearTimeout(self.timeout3);
        });

        // this.videoJSplayer.on("click", function (e) {
        //   if (e.target.classList[0] != "vjs-icon-placeholder") {
        //     self.videoJSplayer.pause();
        //   }
        // });

        if (self.videoWatchDto.thumbnailUrl) {
          this.videoJSplayer.poster(self.videoWatchDto.thumbnailUrl);
        }

        this.videoJSplayer.on("seeking", function(event) {
          self.showOverlay = false;
        });
    
        this.videoJSplayer.on("seeked", function(event) {
          let player = self.videoJSplayer;
          let playerIsPlaying = false;
          if (player) {
            playerIsPlaying = player.currentTime() > 0 && !player.paused() && !player.ended();
          }
          if (!playerIsPlaying) {
            self.showOverlay = true;
          }
        });

        let firstLineContent = '<div class="play-video-series-redirect">' +
            '<img class="play-video-series-thumb" src="' + self.videoWatchDto.seriesThumbnail + '" />' + 
            '<a href="javascript:void(0)" class="play-video-series-name">' + self.videoWatchDto.seriesName + '</a>' +
            '<div style="width: 8px;"></div>' +
            '<div class="by-inside-video">- by</div>' +
            '<div style="width: 8px;"></div>';

        if (self.videoWatchDto.producerThumbnail) {
          firstLineContent = firstLineContent + '<img class="play-video-prod-thumb" src="' + self.videoWatchDto.producerThumbnail + '" />';
        }
        
        firstLineContent = firstLineContent + '<a href="javascript:void(0)" class="play-video-prod-name">' + self.videoWatchDto.producerName + '</a>' +
          '</div>';
  
        let secondLineContent = '<div class="play-video-series">' +
          '<span>S' + self.videoWatchDto.season + ' E' + self.videoWatchDto.episode + ': ' + '<b>' + self.videoWatchDto.title + '</b></span>' + 
          '</div>';
  
        let logoPartContent = '<div class="channel-badge">' + 
            '<img class="invideo-logo" src="assets/logo.png">' + 
            '<div class="invideo-channel">Canalul ' + self.channelDisplayName + '</div>' + 
          '</div>';
          
        this.videoJSplayer.newoverlay({
          contentOfOverlay: firstLineContent + secondLineContent + logoPartContent,
          changeDuration:1000
        });

        let skipThumbnailTime: number;
        if (self.videoWatchDto.length > self.bigVideoLengthSeconds) {
          skipThumbnailTime = self.numberOfSecondsForPreviewBigVideo;
        }
        else {
          skipThumbnailTime = self.numberOfSecondsForPreview;
        }

        if (self.videoWatchDto.controlbarThumbnailsUrl) {
          let noOfThumbs = Math.floor(self.videoWatchDto.length / skipThumbnailTime) + 1;
          if(noOfThumbs >= 1) {

            let thumbnailsObj = {
              0: {
                src: self.videoWatchDto.controlbarThumbnailsUrl,
                style: {
                  left: '-80px',
                  width: ((noOfThumbs + 1) * self.constants.videoThumbWidth) + 'px',
                  height: '88px',
                  clip: 'rect(0, 160px, 88px, 0)'
                }
              }
            };

            for(let i = 1; i < noOfThumbs; i++){
              let thumbTime = i * skipThumbnailTime;
              let thumbLeft = self.constants.videoThumbWidth / 2 + i * self.constants.videoThumbWidth;
              let thumbLeftString = '-' + thumbLeft + 'px';

              let thumbClipB = self.constants.videoThumbWidth * (i + 1);
              let thumbClipC = self.constants.videoThumbHeight;
              let thumbClipD = self.constants.videoThumbWidth * i;
              let thumbClipString = 'rect(0, ' + thumbClipB + 'px, ' + thumbClipC + 'px, ' + thumbClipD + 'px)';

              thumbnailsObj[thumbTime] = {
                style: {
                  left: thumbLeftString,
                  clip: thumbClipString
                }
              }
            }
          
            this.videoJSplayer.thumbnails(thumbnailsObj);
          }
        }
        
        this.videoJSplayer.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          // enableModifiersForNumbers: false
        });
        
        let elem = document.getElementById("mainWrapper");
        if (elem) {
          self.globalRedirectClickHandler = function(event: any) {
            if (event.target.classList.contains("play-video-series-name") || event.target.classList.contains("play-video-series-thumb")) {
              self.utilsService.navigateInSlider('/series/' + self.videoWatchDto.seriesId);
            }
            else if (event.target.classList.contains("play-video-prod-name") || event.target.classList.contains("play-video-prod-thumb")) {
              self.utilsService.navigateInSlider('/producer/' + self.videoWatchDto.producerId);
            }
          }
  
          elem.addEventListener('click', self.globalRedirectClickHandler, true);
        }

        let controlElem = document.getElementsByClassName('vjs-control-bar')[0];
        if (controlElem) {
          controlElem.addEventListener('mouseenter', (event: any) => {
            self.dataService.changeShowLogo(false);

            if (self.timeout2) {
              clearTimeout(self.timeout2);
            }
          });
  
          controlElem.addEventListener('mouseleave', (event: any) => {
            if (self.timeout2) {
              self.timeout4 = setTimeout(() => {
                if (self.isVideoPlaying()) {
                  self.showOverlay = false;
                  self.videoJSplayer.userActive(false);
                  self.dataService.changeShowLogo(true);
                }
              }, 100);
            }
          });
        }
  
        setTimeout(() => {
          let titleElem = document.getElementsByClassName('vjs-emre')[0];
          if (titleElem) {
            titleElem.addEventListener('mouseenter', (event: any) => {
              self.dataService.changeShowLogo(false);

              if (self.timeout2) {
                clearTimeout(self.timeout2);
              }
            });
  
            titleElem.addEventListener('mouseleave', (event: any) => {
              if (self.timeout2) {
                self.timeout4 = setTimeout(() => {
                  if (self.isVideoPlaying()) {
                    self.showOverlay = false;
                    self.videoJSplayer.userActive(false);
                    self.dataService.changeShowLogo(true);
                  }
                }, 100);
              }
            });
          }
        }, 100);
      }, 100);
    });

    this.initMyChannel();
  }

  public initMyChannel(): void {
    if (this.videoWatchDto) {
      return;
    }

    this.isRequestLoading = true;

    let lastEpisodeId = this.utilsService.getLastEpisodeInChannel('myChannel');
    let input: GetMyChannelVideoInput = {
      lastVideoId: lastEpisodeId
    };

    this.channelService.getMyChannelVideo(input)
      .subscribe(
        (response: BaseResponse<VideoWatchDto>) => {
          if (response.status == 200 && response.data) {
            this.dataService.changeMyChannelPlayingNowVideo(response.data);
          }
          else if( response.status == 422) {
            if (response.generalErrors[0].startsWith('Nu urmaresti')) {
              this.notificationService.fail('Pentru a putea accesa Canalul Meu trebuie sa urmaresti cel putin o emisiune. Vei fi redirectat la canalul General.');
              this.utilsService.navigateInPlayer('general');
            }
            else {
              this.notificationService.fail('Pentru a putea accesa Canalul Meu, emisiunile urmarite de tine trebuie sa contina episoade. Vei fi redirectat la canalul General.');
              this.utilsService.navigateInPlayer('general');
            }
          }
          else {
              this.notificationService.fail('Ceva nu a mers bine. Vei fi redirectat la canalul General.');
              this.utilsService.navigateInPlayer('general');
          }
        },
        error => {
          this.notificationService.fail('Ceva nu a mers bine. Vei fi redirectat la canalul General.');
          this.utilsService.navigateInPlayer('general');
        }
      );
  }

  public goToNextVideo(): void {

    this.isRequestLoading = true;

    // SUPER IMPORTANT 
    // Remove the video before creating e new one 
    this.removeVideoBeforeCreatingNew();

    let input: GetMyChannelNextVideoInput = {
      currentVideoId: this.videoId
    };

    this.channelService.getMyChannelNextVideo(input)
      .subscribe(
        (response: BaseResponse<VideoWatchDto>) => {
          if (response.status == 200 && response.data) {
            this.dataService.changeMyChannelPlayingNowVideo(response.data);
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Vei fi redirectat la canalul General.');
            this.utilsService.navigateInPlayer('general');
          }
        },
        error => {
          this.notificationService.fail('Ceva nu a mers bine. Vei fi redirectat la canalul General.');
          this.utilsService.navigateInPlayer('general');
        }
      );
  }

  public goToPreviousVideo(): void {

    this.isRequestLoading = true;

    // SUPER IMPORTANT 
    // Remove the video before creating e new one 
    this.removeVideoBeforeCreatingNew();

    let input: GetMyChannelNextVideoInput = {
      currentVideoId: this.videoId
    };

    this.channelService.getMyChannelPreviousVideo(input)
      .subscribe(
        (response: BaseResponse<VideoWatchDto>) => {
          if (response.status == 200 && response.data) {
            this.dataService.changeMyChannelPlayingNowVideo(response.data);
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Vei fi redirectat la canalul General.');
            this.utilsService.navigateInPlayer('general');
          }
        },
        error => {
          this.notificationService.fail('Ceva nu a mers bine. Vei fi redirectat la canalul General.');
          this.utilsService.navigateInPlayer('general');
        }
      );
  }

  public anotherTest(): void {
    if (!this.utilsService.getTest()) {
      this.userService.test()
        .subscribe(
          (data: BaseResponse<string>) => {
            this.utilsService.setTest(data.data);
            this.testTheApi();
          },
          error => {
          }
        );
    }
    else {
      this.testTheApi();
    }
  }

  public testTheApi(): void {
    let pingInput: PingInput = {
      ex: this.videoId,
      y: this.utilsService.getTest()
    };

    this.videoService.ping(pingInput)
      .subscribe(
        (response: BaseResponse) => {
          if(response && response.status == 500) {
            this.utilsService.deleteTest();
          }
        },
        error => {
          this.utilsService.deleteTest();
        }
      );
  }
  public clickMock() {
    let self = this;
    this.pauseVideo();

    if (this.timeoutFS2) {
      (document.getElementsByClassName('vjs-fullscreen-control')[0] as any).click();
      clearTimeout(this.timeoutFS2);
      this.timeoutFS2 = null;
      this.videoJSplayer.pause();
      return;
    }

    this.timeoutFS1 = setTimeout(() => {
      self.timeoutFS1 = null;
    }, 300);
  }

  public clickOverlayPlay(): void {
    let self = this;

    if (this.timeoutFS1) {
      (document.getElementsByClassName('vjs-fullscreen-control')[0] as any).click();
      clearTimeout(this.timeoutFS1);
      this.timeoutFS1 = null;
      this.videoJSplayer.play();
      return;
    }

    if (this.videoJSplayer) {
      this.videoJSplayer.play();
    }

    this.timeoutFS2 = setTimeout(() => {
      self.timeoutFS2 = null;
    }, 300);
  }

  public clickOverlayPause(): void {
    let self = this;
    this.pauseVideo();

    if (this.timeoutFS2) {
      (document.getElementsByClassName('vjs-fullscreen-control')[0] as any).click();
      clearTimeout(this.timeoutFS2);
      this.timeoutFS2 = null;
      this.videoJSplayer.pause();
      return;
    }

    this.timeoutFS1 = setTimeout(() => {
      self.timeoutFS1 = null;
    }, 300);
  }

  public pauseVideo(): void {
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);

    if (this.videoJSplayer) {
      this.videoJSplayer.pause();
      this.showOverlay = true;
      this.videoJSplayer.userActive(true);
    }
  }

  public handleToggleOnMenuBtn() {
    this.isVideoLargeScreen = !this.isVideoLargeScreen;
    this.dataService.changeIsVideoLargeScreen(this.isVideoLargeScreen);
  }

  public goToGeneralChanngel(): void {
    this.utilsService.navigateInPlayer('general');
  }

  ///////////////////////////////////////////////////////////////
  
  public mouseEnterMock() {
    clearTimeout(this.timeout3);
    if (this.timeout2) {
      clearTimeout(this.timeout1);
      clearTimeout(this.timeout2);
      this.videoJSplayer.userActive(false);
      this.dataService.changeShowLogo(true);
    }
    else {
      clearTimeout(this.timeout1);
      clearTimeout(this.timeout2);
      this.showPrevNextEp = true;
      this.showOverlay = true;
      this.videoJSplayer.userActive(true);
      this.dataService.changeShowLogo(false);
    }
  }

  public mouseLeaveMock() {
    clearTimeout(this.timeout1);

    // let self = this;
    // this.timeout1 = setTimeout(() => {
    //   self.showOverlay = false;
    //   self.dataService.changeShowLogo(true);
    // }, 100);
  }

  public mouseMoveMock(){
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);

    this.videoJSplayer.userActive(true);

    this.showOverlay = true;
    this.dataService.changeShowLogo(false);
  }

  public mouseEnterPause() {
    clearTimeout(this.timeout3);
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
    clearTimeout(this.timeout4);

    this.videoJSplayer.userActive(true);

    let self = this;
    this.timeout2 = setTimeout(() => {

      self.videoJSplayer.userActive(false);
      self.showOverlay = false;
      self.dataService.changeShowLogo(true);
    }, 2000);
  }

  public mouseLeavePause() {
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
    clearTimeout(this.timeout3);
    clearTimeout(this.playRemoveOverlayTimeout);

    let self = this;
    this.timeout2 = setTimeout(() => {
      self.showOverlay = false;
      self.dataService.changeShowLogo(true);

      self.videoJSplayer.userActive(false);

    }, 100);
  }

  public mouseMovePause() {
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);

    this.videoJSplayer.userActive(true);
    let self = this;
    this.timeout2 = setTimeout(() => {
      self.showOverlay = false;
      self.dataService.changeShowLogo(true);

      self.videoJSplayer.userActive(false);

    }, 2000);
  }
  
  ///////////////////////////////////////////////////////////////

  public isVideoPlaying(): boolean {
    let player = this.videoJSplayer;
    let playerIsPlaying = false;
    if (player) {
      playerIsPlaying = player.currentTime() > 0 && !player.paused() && !player.ended();
    }

    return playerIsPlaying;
  }

  
  public ngDoCheck() {
    if(document.getElementById('videoPlayerId')) {
      if(document.getElementById('videoPlayerId').classList.contains('vjs-user-inactive') &&
        !document.getElementById('videoPlayerId').classList.contains('vjs-ended') &&
        !document.getElementById('videoPlayerId').classList.contains('vjs-paused')){
        // logo should be 
        this.dataService.changeShowLogo(true);
        this.showPrevNextEp = false;
      }
      else {
        // logo should NOT be 
        this.dataService.changeShowLogo(false);
        this.showPrevNextEp = true;
      }
    }
  }

  public somethigWentWrongHandler() {
    this.isResourceNotFound = true;
    this.showPlayBtn = false;
    this.showPrevNextEp = false;
    if (this.videoJSplayer) {
      this.videoJSplayer.dispose();
      this.videoJSplayer = null;
    }

    this.videoWatchDto = null;
  }

  public removeVideoBeforeCreatingNew() {
    let elem = document.getElementById("mainWrapper");
    if (elem) {
      elem.removeEventListener("click", this.globalRedirectClickHandler, true);
    }

    if (this.videoJSplayer) {
      this.videoJSplayer.dispose();
      this.videoJSplayer = null;
    }
    this.videoWatchDto = null;
  }

}
