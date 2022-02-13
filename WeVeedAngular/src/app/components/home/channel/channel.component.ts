import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ChannelService } from '../../../services/channel/channel.service';
import { DataService } from '../../../services/data/data.service';
import { GetChannelVideoInput } from '../../../generated-models/GetChannelVideoInput';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { VideoWatchDto } from '../../../generated-models/VideoWatchDto';
import { Constants } from '../../../constants/Constants';
import { UtilsService } from '../../../services/utils/utils.service';
import { GetChannelNextVideoInput } from '../../../generated-models/GetChannelNextVideoInput';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../../services/user/user.service';
import { PingInput } from '../../../generated-models/PingInput';
import { VideoService } from '../../../services/video/video.service';
import { Subscription } from 'rxjs';
import { debug } from 'util';

declare var videojs: any;
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
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
export class ChannelComponent implements OnInit, OnDestroy {

  public channelName: string;
  public channelDisplayName: string;
  
  private videoJSplayer: any;
  private inactTimeout: number = 0;
  
  private numberOfSecondsForPreview: number = 5;
  private numberOfSecondsForPreviewBigVideo: number = 20;
  public bigVideoLengthSeconds: number = 900;
  
  @ViewChild('videoPlayerId') videoPlayerId: any;
  public videoSrc: string;

  public videoId: string;

  public isVideoLargeScreen: boolean = false;

  public isResourceNotFound: boolean = false;
  public isSomethingWentWrong: boolean = false;
  public isRequestLoading: boolean = true;

  public videoWatchDto: VideoWatchDto;

  public showPrevNextEp: boolean = false;
  public showPlayBtn: boolean = true;

  public channelVideoIdForNextVideoPlayItemSubscription: Subscription;
  public channelVideoPlayingNowItemSubscription: Subscription;

  public playRemoveOverlayTimeout: any;

  public timeout1: any;
  public timeout2: any;
  public timeout3: any;
  public timeout4: any;
  public timeout5: any;

  public timeoutFS1: any;
  public timeoutFS2: any;

  public showOverlay: boolean = true;

  public globalRedirectClickHandler: any;

  public specificVideoIdOpenWithChannel: string = null;

  constructor(private channelService: ChannelService, private dataService: DataService, private constants: Constants, 
    private utilsService: UtilsService, private userService: UserService, private videoService: VideoService) { }
  
  ngOnDestroy(): void {
    this.channelVideoIdForNextVideoPlayItemSubscription.unsubscribe();
    this.channelVideoPlayingNowItemSubscription.unsubscribe();
    document.getElementById('mainWrapper').onclick = null;

    this.removeVideoBeforeCreatingNew();
  }

  ngOnInit() {
    let thisSelf = this;
    document.getElementById('mainWrapper').onclick = function(e) {
      thisSelf.videoJSplayer.focus();
    }

    this.channelVideoIdForNextVideoPlayItemSubscription = this.dataService.channelVideoIdForNextVideoPlayItem.subscribe((videoId: string) => {
      if (!videoId) {
        return;
      }

      this.isResourceNotFound = false;
      this.isSomethingWentWrong = false;
      this.isRequestLoading = true;

      // SUPER IMPORTANT 
      // Remove the video before creating a new one 
      this.removeVideoBeforeCreatingNew();

      this.videoService.getWatchDtoById(videoId)
        .subscribe(
          (response: BaseResponse<VideoWatchDto>) => {
            this.isRequestLoading = false;
            if (response.status == 200 && response.data) {
              this.renderVideo(response.data);
            }
            else {
              this.somethigWentWrongHandler();
            }
          },
          error => {
            this.somethigWentWrongHandler();
          }
        );
    });

    this.channelVideoPlayingNowItemSubscription = this.dataService.channelVideoPlayingNowItem.subscribe((value: string) => {
      this.channelName = value;
      this.channelDisplayName = this.constants.channelNamingMapping[value];

      this.isResourceNotFound = false;
      this.isSomethingWentWrong = false;
      this.isRequestLoading = true;

      // SUPER IMPORTANT 
      // Remove the video before creating e new one 
      this.removeVideoBeforeCreatingNew();

      let lastEpisodeId = this.utilsService.getLastEpisodeInChannel(this.channelName);
      let input: GetChannelVideoInput = {
        channelName: value,
        lastVideoId: lastEpisodeId
      };

      if (this.dataService.videoIdToPlayInChannel) {
        let toBePlayedVideoId = this.dataService.videoIdToPlayInChannel;
        this.dataService.changeVideoIdThatWillPlayInChannel(null);

        this.videoService.getWatchDtoById(toBePlayedVideoId)
          .subscribe(
            (response: BaseResponse<VideoWatchDto>) => {
              this.isRequestLoading = false;
              if (response.status == 200 && response.data) {
                this.renderVideo(response.data);
              }
              else {
                this.somethigWentWrongHandler();
              }
            },
            error => {
              this.somethigWentWrongHandler();
            }
          );
      }
      else {
        this.channelService.getChannelVideo(input)
          .subscribe(
            (response: BaseResponse<VideoWatchDto>) => {
              this.isRequestLoading = false;
              if (response.status == 200 && response.data) {
                this.renderVideo(response.data);
              }
              else {
                this.somethigWentWrongHandler();
              }
            },
            error => {
              this.somethigWentWrongHandler();
            }
          );
      }
    });
  }

  public handleToggleOnMenuBtn() {
    this.isVideoLargeScreen = !this.isVideoLargeScreen;
    this.dataService.changeIsVideoLargeScreen(this.isVideoLargeScreen);
  }

  public goToGeneralChanngel(): void {
    this.utilsService.navigateInPlayer('general');
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  public goToVideoInSlider(): void {
  }

  public playVideo(): void {
    if (this.videoJSplayer) {
      this.videoJSplayer.play();
    }
  }

  public pauseVideo(): void {
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);

    if (this.videoJSplayer) {
      this.videoJSplayer.pause();
    }
  }

  public goToNextVideo(): void {
    this.isResourceNotFound = false;
    this.isSomethingWentWrong = false;
    this.isRequestLoading = true;

    // SUPER IMPORTANT 
    // Remove the video before creating e new one 
    this.removeVideoBeforeCreatingNew();

    let input: GetChannelNextVideoInput = {
      channelName: this.channelName,
      currentVideoId: this.videoId
    };

    this.channelService.getChannelNextVideo(input)
        .subscribe(
          (response: BaseResponse<VideoWatchDto>) => {
            this.isRequestLoading = false;
            if (response.status == 200 && response.data) {
              this.renderVideo(response.data);
            }
            else {
              this.somethigWentWrongHandler();
            }
          },
          error => {
            this.somethigWentWrongHandler();
          }
        );
  }

  public goToPreviousVideo(): void {
    this.isResourceNotFound = false;
    this.isSomethingWentWrong = false;
    this.isRequestLoading = true;

    // SUPER IMPORTANT 
    // Remove the video before creating e new one 
    this.removeVideoBeforeCreatingNew();

    let input: GetChannelNextVideoInput = {
      channelName: this.channelName,
      currentVideoId: this.videoId
    };

    this.channelService.getChannelPreviousVideo(input)
        .subscribe(
          (response: BaseResponse<VideoWatchDto>) => {
            this.isRequestLoading = false;
            if (response.status == 200 && response.data) {
              this.renderVideo(response.data);
            }
            else {
              this.somethigWentWrongHandler();
            }
          },
          error => {
            this.somethigWentWrongHandler();
          }
        );
  }

  // ################## VERY IMPORTANT ##################
  // ################## The method that renders the video ##################
  public renderVideo(videoWatchDtoInput: VideoWatchDto): void {
    this.videoWatchDto = videoWatchDtoInput;
    this.videoId = videoWatchDtoInput.id;
    this.utilsService.saveLastEpisodeInChannel(this.channelName, this.videoId);

    let privateSelf = this;
    privateSelf.dataService.changeChannelVideoIdPlayNow(privateSelf.videoId);
    privateSelf.dataService.changeChannelVideoPlayingNowDiffItem(privateSelf.channelName);

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
          '<div class="invideo-channel">Canal ' + self.channelDisplayName + '</div>' + 
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  }

  public isVideoPlaying(): boolean {
    let player = this.videoJSplayer;
    let playerIsPlaying = false;
    if (player) {
      playerIsPlaying = player.currentTime() > 0 && !player.paused() && !player.ended();
    }

    return playerIsPlaying;
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
