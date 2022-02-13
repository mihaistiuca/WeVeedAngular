import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { UserBasicInfoDto } from '../../../../generated-models/UserBasicInfoDto';
import { Subscription } from 'rxjs';
import { CommentCreateInput } from '../../../../generated-models/CommentCreateInput';
import { CommentService } from '../../../../services/comment/comment.service';
import { BaseResponse } from '../../../../basic-models/BaseResponse';
import { NotificationService } from '../../../../services/notification/notification.service';
import { CommentDisplayUiDto } from '../../../../generated-models/CommentDisplayUiDto';
import { VideoCommentPaginationInput } from '../../../../generated-models/VideoCommentPaginationInput';
import { AuthService } from '../../../../services/auth/auth.service';
import { VideoPlayingNowDto } from 'src/app/generated-models/VideoPlayingNowDto';
import { VideoService } from 'src/app/services/video/video.service';

@Component({
  selector: 'app-comments-tab',
  templateUrl: './comments-tab.component.html',
  styleUrls: ['./comments-tab.component.css']
})
export class CommentsTabComponent implements OnInit, OnDestroy {

  public commentValue: string;
  public isSendCommentLoading: boolean;

  public singleVideoSubscription: Subscription;
  public channelVideoSubscription: Subscription;
  public currentUserSubscription: Subscription;

  public currentUserId: string;
  public currentUserInfo: UserBasicInfoDto;

  public videoPlayingNow: string;

  public comments: CommentDisplayUiDto[] = [];

  public areThereAnyMoreComments: boolean = true;
  public moreCommentsAreLoading: boolean = false;
  public commentsScrollPage: number = 1;
  
  public videoInfo: VideoPlayingNowDto;
  public isVideoInfoLoading: boolean;

  public isFocusedOnComment: boolean = false;

  constructor(private dataService: DataService, private commentService: CommentService, private notificationService: NotificationService,
    private authService: AuthService, private videoService: VideoService) { }

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();

    this.currentUserSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      if(value == null) {
        return;
      }

      this.currentUserInfo = value;
    });

    // video change SIMPLE 
    this.singleVideoSubscription = this.dataService.videoPlayingNowItem.subscribe((value: string) => {
      if(value == null) {
        return;
      }

      this.videoPlayingNow = value;
      this.initSingleVideoInfo();
      this.initComments();
    });

    // video change in CHANNEL 
    this.channelVideoSubscription = this.dataService.channelVideoIdPlayNow.subscribe((value: string) => {
      if(value == null) {
        return;
      }

      this.videoPlayingNow = value;
      this.initSingleVideoInfo();
      this.initComments();
    });
  }
  
  ngOnDestroy(): void {
    this.singleVideoSubscription.unsubscribe();
    this.channelVideoSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }

  public initSingleVideoInfo(): void {
    this.isVideoInfoLoading = true;

    this.videoService.getPlayingNowById(this.videoPlayingNow)
    .subscribe(
      (response: BaseResponse<VideoPlayingNowDto>) => {
        if (response.status == 200 && response.data) {
          this.videoInfo = response.data;
          this.isVideoInfoLoading = false;
        }
        else {
          this.isVideoInfoLoading = false;
          // this.utilsService.navigateToSliderError();
        }
      },
      error => {
          this.isVideoInfoLoading = false;
          // this.utilsService.navigateToSliderError();
      }
    );
  }

  public onChangeComment(e: any): void {
    this.commentValue = e;
  }

  public clickComment(): void {
    if (!this.currentUserInfo) {
      this.notificationService.fail('Trebuie sa fii conectat pentru a putea lasa un comentariu.');
      return;
    }
    
    if (!this.commentValue) {
      return;
    }
    
    this.isSendCommentLoading = true;

    let input: CommentCreateInput = {
      text: this.commentValue,
      videoId: this.videoPlayingNow
    }

    this.commentService.createComment(input)
      .subscribe(
        (data: BaseResponse<string>) => {
          this.isSendCommentLoading = false;

          if(data.status == 200) {

            let newComment: CommentDisplayUiDto = {
              id: data.data,
              text: this.commentValue,
              userId: this.currentUserId,
              userName: this.currentUserInfo.userType == 'producer' ? this.currentUserInfo.producerName : this.currentUserInfo.firstName + ' ' + this.currentUserInfo.lastName,
              userIsProducer: this.currentUserInfo.userType == 'producer',
              userProfileImageUrl: this.currentUserInfo.profileImageUrl,
              commentTime: new Date()
            };

            this.comments.unshift(newComment);

            this.commentValue = null;
            this.isFocusedOnComment = false;
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
        },
        error => {
          this.isSendCommentLoading = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      )
  }

  public initComments(): void {
    this.areThereAnyMoreComments = true;
    this.moreCommentsAreLoading = true;
    this.comments = [];

    let input: VideoCommentPaginationInput = {
      page: 1,
      pageSize: 10,
      videoId: this.videoPlayingNow
    };

    this.commentService.getAllByVideoPaginated(input)
      .subscribe(
        (response: BaseResponse<CommentDisplayUiDto[]>) => {
          if (response.status == 500) {
            this.notificationService.fail('Incarcarea comentariilor nu a reusit');
            this.moreCommentsAreLoading = false;
          }
          else if (response.status == 200) {
            this.moreCommentsAreLoading = false;

            if (response.data.length < 10) {
              this.areThereAnyMoreComments = false;
            }

            this.comments = response.data;
          }
          else  {
            this.notificationService.fail('Incarcarea comentariilor nu a reusit');
            this.moreCommentsAreLoading = false;
          }
        },
        error => {
          this.notificationService.fail('Incarcarea comentariilor nu a reusit');
          this.moreCommentsAreLoading = false;
        }
      );
  }

  public loadMoreComments(): void {
    this.commentsScrollPage++;
    this.moreCommentsAreLoading = true;

    let input: VideoCommentPaginationInput = {
      page: this.commentsScrollPage,
      pageSize: 10,
      videoId: this.videoPlayingNow
    };

    this.commentService.getAllByVideoPaginated(input)
      .subscribe(
        (response: BaseResponse<CommentDisplayUiDto[]>) => {
          if (response.status == 500) {
            this.notificationService.fail('Incarcarea comentariilor nu a reusit');
            this.moreCommentsAreLoading = false;
          }
          else if (response.status == 200) {
            this.moreCommentsAreLoading = false;

            if (response.data.length < 10) {
              this.areThereAnyMoreComments = false;
            }

            this.comments = this.comments.concat(response.data);
          }
          else  {
            this.notificationService.fail('Incarcarea comentariilor nu a reusit');
            this.moreCommentsAreLoading = false;
          }
        },
        error => {
          this.notificationService.fail('Incarcarea comentariilor nu a reusit');
          this.moreCommentsAreLoading = false;
        }
      );
  }

}
