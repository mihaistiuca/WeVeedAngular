import { Component, OnInit, ViewChild, Input, DoCheck, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { DataService } from '../../../services/data/data.service';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../../services/video/video.service';
import { BaseResponse } from '../../../basic-models/BaseResponse';
import { VideoWatchDto } from '../../../generated-models/VideoWatchDto';
import { UtilsService } from '../../../services/utils/utils.service';
import { Constants } from '../../../constants/Constants';
import { PingInput } from '../../../generated-models/PingInput';
import { Subscription } from 'rxjs';
declare var videojs: any;
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, DoCheck, OnDestroy {

  private videoJSplayer: any;
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
  private inactTimeout: number = 0;

  public showLogoSubscription: Subscription;
  public videoPlayingNowItemSubscription: Subscription;

  public timeout1: any;
  public timeout2: any;

  public timeout4: any;

  public timeoutFS1: any;
  public timeoutFS2: any;

  public globalRedirectClickHandler: any;

  constructor(private userService: UserService, private dataService: DataService, private activatedRoute: ActivatedRoute, private constants: Constants,
    private videoService: VideoService, private utilsService: UtilsService) {
      this.videoSrc = 'http://techslides.com/demos/sample-videos/small.mp4#t=10';
   }

  ngOnDestroy() {
    this.showLogoSubscription.unsubscribe();
    this.videoPlayingNowItemSubscription.unsubscribe();
    document.getElementById('mainWrapper').onclick = null;

    this.removeVideoBeforeCreatingNew();
  }

  ngOnInit() {
    let thisSelf = this;
    document.getElementById('mainWrapper').onclick = function(e) {
      thisSelf.videoJSplayer.focus();
    }

    this.showLogoSubscription = this.dataService.showLogo.subscribe((value: boolean) => {
      this.showPrevNextEp = value;
    });

    this.videoPlayingNowItemSubscription = this.dataService.videoPlayingNowItem.subscribe((value: string) => {
      this.videoId = value;

      this.isResourceNotFound = false;
      this.isSomethingWentWrong = false;
      this.isRequestLoading = true;

      this.removeVideoBeforeCreatingNew();

      this.videoService.getWatchDtoById(this.videoId)
        .subscribe(
          (response: BaseResponse<VideoWatchDto>) => {
            this.isRequestLoading = false;
            if (response.status == 200 && response.data) {
              this.videoWatchDto = response.data;
              var self = this;

              this.anotherTest();

              setTimeout(() => {
                this.videoJSplayer = videojs(document.getElementById('videoPlayerId'), {inactivityTimeout: self.inactTimeout, playbackRates: [0.5, 1, 1.25, 1.5, 2]}, function() {
                  var myPlayer = this;
                  myPlayer.ready(function() {
                    self.videoJSplayer.play();
                  });
                });

                this.dataService.changeShowLogo(false);

                this.timeout2 = setTimeout(() => {
                  if (self.isVideoPlaying()) {
                    self.videoJSplayer.userActive(false);
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

                if (self.videoWatchDto.thumbnailUrl) {
                  this.videoJSplayer.poster(self.videoWatchDto.thumbnailUrl);
                }

                this.videoJSplayer.on("play", function () {
                  self.showPlayBtn = false;
                  self.videoJSplayer.userActive(true);
                });

                this.videoJSplayer.on("pause", function () {
                  self.showPlayBtn = true;
                  self.videoJSplayer.userActive(true);
                });

                this.videoJSplayer.on("seeking", function(event) {
                  self.showPlayBtn = false;
                });

                // this.videoJSplayer.on("click", function(event) {
                //   event.preventDefault();
                //   debugger;
                // });
            
                this.videoJSplayer.on("seeked", function(event) {
                  let player = self.videoJSplayer;
                  let playerIsPlaying = false;
                  if (player) {
                    playerIsPlaying = player.currentTime() > 0 && !player.paused() && !player.ended();
                  }
                  if (!playerIsPlaying) {
                    self.showPlayBtn = true;
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

                this.videoJSplayer.newoverlay({
                  contentOfOverlay: firstLineContent + secondLineContent,
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
                  seekStep: 5
                  // enableModifiersForNumbers: false // THIS IS VERY BAD. IT CAUSES VIDEO TO START WITHOUT REASON! 
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
                
                setTimeout(() => {
                  let vvv = document.getElementsByTagName("html")[0];
                  vvv.addEventListener('click', (event: any) => {
                    if (event.target.localName == "app-video") {
                      
                      event.preventDefault();
                      self.videoJSplayer.userActive(true);
                    }
                  });
                }, 100);

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
                            self.videoJSplayer.userActive(false);
                            self.dataService.changeShowLogo(true);
                          }
                        }, 100);
                      }
                    });
                  }
                }, 100);

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
                          self.videoJSplayer.userActive(false);
                          self.dataService.changeShowLogo(true);
                        }
                      }, 100);
                    }
                  });
                }

                // let playBtn = document.getElementsByClassName("play-video")[0];
                // playBtn.addEventListener('click', (event: any) => {
                //   this.videoJSplayer.play();
                // });
              }, 100);
            }
            else if( response.status == 500) {
              this.isSomethingWentWrong = true;
              this.showPlayBtn = false;
              this.videoWatchDto = null;
            }
            else {
              this.isResourceNotFound = true;
              this.showPlayBtn = false;
              this.videoWatchDto = null;
            }
          },
          error => {
            this.isRequestLoading = false;
            this.isSomethingWentWrong = true;
            this.videoWatchDto = null;
          }
        );
    });
  }

  public handleToggleOnMenuBtn() {
    this.isVideoLargeScreen = !this.isVideoLargeScreen;
    this.dataService.changeIsVideoLargeScreen(this.isVideoLargeScreen);
  }

  public goToGeneralChanngel(): void {
    this.utilsService.navigateInPlayer('general');
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

  public clickOverlay(): void {
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

  public pauseVideo(): void {
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);

    if (this.videoJSplayer) {
      this.videoJSplayer.pause();
    }
  }

  public mouseEnterMock() {
    clearTimeout(this.timeout4);
    this.videoJSplayer.userActive(true);
    this.dataService.changeShowLogo(false);
  }

  public mouseLeaveMock() {
    clearTimeout(this.timeout1);

    this.timeout2 = setTimeout(() => {
      this.videoJSplayer.userActive(false);
      this.dataService.changeShowLogo(true);
    }, 50);
  }

  public mouseMoveMock() {
    clearTimeout(this.timeout1);
    this.videoJSplayer.userActive(true);
    this.dataService.changeShowLogo(false);

    this.timeout1 = setTimeout(() => {
      this.videoJSplayer.userActive(false);
      this.dataService.changeShowLogo(true);
    }, 2000);
  }

  public isVideoPlaying(): boolean {
    let player = this.videoJSplayer;
    let playerIsPlaying = false;
    if (player) {
      playerIsPlaying = player.currentTime() > 0 && !player.paused() && !player.ended();
    }

    return playerIsPlaying;
  }
  
  public ngDoCheck() {

    // if(document.getElementById('videoPlayerId')) {
    //   if(document.getElementById('videoPlayerId').classList.contains('vjs-user-inactive') &&
    //     !document.getElementById('videoPlayerId').classList.contains('vjs-ended') &&
    //     !document.getElementById('videoPlayerId').classList.contains('vjs-paused')){
    //     // logo should be 
    //     this.dataService.changeShowLogo(true);
    //   }
    //   else {
    //     // logo should NOT be 
    //     this.dataService.changeShowLogo(false);
    //   }
    // }
  }

  public goToVideoInSlider(): void {
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
