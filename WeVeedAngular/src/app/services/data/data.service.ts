import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserBasicInfoDto } from '../../generated-models/UserBasicInfoDto';
import { VideoWatchDto } from '../../generated-models/VideoWatchDto';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private isVideoLargeScreenSubject = new BehaviorSubject(false);
  public currentIsVideoLargeScreen = this.isVideoLargeScreenSubject.asObservable();

  private showLoginInSidebarSubject = new BehaviorSubject(true);
  public currentShowLoginInSidebar = this.showLoginInSidebarSubject.asObservable();

  private showResetPasswordSendEmailSubject = new BehaviorSubject(false);
  public showResetPasswordSendEmail = this.showResetPasswordSendEmailSubject.asObservable();

  private userBasicInfoSubject = new BehaviorSubject<UserBasicInfoDto>(null);
  public currentUserBasicInfo = this.userBasicInfoSubject.asObservable();

  private scrollToBottomDistanceSubject = new BehaviorSubject(Infinity);
  public scrollToBottomDistance = this.scrollToBottomDistanceSubject.asObservable();

  private playingNowItemSubject = new BehaviorSubject<string>(null);
  public playingNowItem = this.playingNowItemSubject.asObservable();

  private videoPlayingNowItemSubject = new BehaviorSubject<string>(null);
  public videoPlayingNowItem = this.videoPlayingNowItemSubject.asObservable();

  private channelVideoPlayingNowItemSubject = new BehaviorSubject<string>(null);
  public channelVideoPlayingNowItem = this.channelVideoPlayingNowItemSubject.asObservable();

  private channelVideoPlayingNowDiffItemSubject = new BehaviorSubject<string>(null);
  public channelVideoPlayingDiffNowItem = this.channelVideoPlayingNowDiffItemSubject.asObservable();

  private channelVideoIdPlayNowSubject = new BehaviorSubject<string>(null);
  public channelVideoIdPlayNow = this.channelVideoIdPlayNowSubject.asObservable();

  private channelVideoIdForNextVideoPlayItemSubject = new BehaviorSubject<string>(null);
  public channelVideoIdForNextVideoPlayItem = this.channelVideoIdForNextVideoPlayItemSubject.asObservable();

  private myChannelPlayingNowItemSubject = new BehaviorSubject<VideoWatchDto>(null);
  public myChannelPlayingNowItem = this.myChannelPlayingNowItemSubject.asObservable();

  private showLogoSubject = new BehaviorSubject(true);
  public showLogo = this.showLogoSubject.asObservable();

  private userWasActivatedSubject = new BehaviorSubject(false);
  public userWasActivated = this.userWasActivatedSubject.asObservable();

  private waitForThisChannelEventInPlayNowSubject = new BehaviorSubject(null);
  public waitForThisChannelEventInPlayNow = this.waitForThisChannelEventInPlayNowSubject.asObservable();

  private isResetPasswordUrlSubject = new BehaviorSubject(true);
  public isResetPasswordUrl = this.isResetPasswordUrlSubject.asObservable();

  public videoIdToPlayInChannel: string = null;
  
  constructor() { }

  public changeIsResetPasswordUrl(value: boolean) {
    this.isResetPasswordUrlSubject.next(value);
  }

  public changeShowResetPasswordSendEmail(value: boolean) {
    this.showResetPasswordSendEmailSubject.next(value);
  }

  public changeIsVideoLargeScreen(value: boolean) {
    this.isVideoLargeScreenSubject.next(value);
  }

  public changeShowLoginInSidebar(value: boolean) {
    this.showLoginInSidebarSubject.next(value);
  }

  public changeUserBasicInfo(value: UserBasicInfoDto) {
    this.userBasicInfoSubject.next(value);
  }

  public changeScrollToBottomDistance(value: number) {
    this.scrollToBottomDistanceSubject.next(value);
  }

  public changePlayingNowItem(value: string) {
    this.playingNowItemSubject.next(value);
  }

  public changeVideoPlayingNowItem(value: string) {
    this.videoPlayingNowItemSubject.next(value);
  }

  public changeChannelVideoPlayingNowDiffItem(value: string) {
    this.channelVideoPlayingNowDiffItemSubject.next(value);
  }

  public changeChannelVideoPlayingNowItem(value: string) {
    this.channelVideoPlayingNowItemSubject.next(value);
  }

  public changeChannelVideoIdPlayNow(value: string) {
    this.channelVideoIdPlayNowSubject.next(value);
  }

  public changeChannelVideoIdForNextVideoPlay(value: string) {
    this.channelVideoIdForNextVideoPlayItemSubject.next(value);
  }

  public changeShowLogo(value: boolean) {
    this.showLogoSubject.next(value);
  }

  public changeMyChannelPlayingNowVideo(value: VideoWatchDto) {
    this.myChannelPlayingNowItemSubject.next(value);
  }

  public changeUserWasActivated(value: boolean) {
    this.userWasActivatedSubject.next(value);
  }

  public changeWaitForThisChannelEventInPlayNow(value: string) {
    this.waitForThisChannelEventInPlayNowSubject.next(value);
  }

  public changeVideoIdThatWillPlayInChannel(value: string) {
    this.videoIdToPlayInChannel = value;
  }
}
