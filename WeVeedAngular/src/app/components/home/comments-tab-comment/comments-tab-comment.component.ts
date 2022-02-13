import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommentDisplayUiDto } from '../../../generated-models/CommentDisplayUiDto';
import { UtilsService } from '../../../services/utils/utils.service';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';
import { UserBasicInfoDto } from 'src/app/generated-models/UserBasicInfoDto';
import { CommentService } from 'src/app/services/comment/comment.service';
import { BaseResponse } from 'src/app/basic-models/BaseResponse';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CommentCreateInput } from 'src/app/generated-models/CommentCreateInput';
import { CommentUpdateInput } from 'src/app/generated-models/CommentUpdateInput';

@Component({
  selector: 'app-comments-tab-comment',
  templateUrl: './comments-tab-comment.component.html',
  styleUrls: ['./comments-tab-comment.component.css']
})
export class CommentsTabCommentComponent implements OnInit, OnDestroy {

  @Input() comment: CommentDisplayUiDto;

  @ViewChild('commentText') commentText: ElementRef;
  public isShowMoreCommentButtonVisible: boolean = false;
  public isShowLessCommentButtonVisible: boolean = false;
  public commentHasTheClass: boolean = true;
  public commentScrollableHeight: string;

  public commentBelongsToUser: boolean = false;
  public currentUserBasicInfoSubscription: Subscription;

  public isDeleteCommentLoading: boolean = false;

  public commentWasDeleted: boolean = false;

  public commentIsInEditMode: boolean = false;

  public commentedUpdatedValue: string;

  public isSendCommentLoading: boolean;

  constructor(private utilsService: UtilsService, private dataService: DataService, private commentService: CommentService, private notificationService: NotificationService) { }

  ngOnDestroy() {
    this.currentUserBasicInfoSubscription.unsubscribe();
  }

  ngOnInit() {
    this.commentedUpdatedValue = this.comment.text;

    this.currentUserBasicInfoSubscription = this.dataService.currentUserBasicInfo.subscribe((value: UserBasicInfoDto) => {
      
      if (!value) {
        return;
      }

      this.commentBelongsToUser = value.id == this.comment.userId;
    });

    var self = this;
    setTimeout(() => {
      self.isShowMoreCommentButtonVisible = self.commentText.nativeElement.scrollHeight != self.commentText.nativeElement.offsetHeight;
      self.commentHasTheClass = self.isShowMoreCommentButtonVisible;
      if (!self.commentHasTheClass) {
        self.commentScrollableHeight = self.commentText.nativeElement.scrollHeight + 'px';
      }
    }, 200);
  }

  public onChangeComment(e: any): void {
    this.commentedUpdatedValue = e;
  }

  public clickComment(): void {

    if (!this.commentedUpdatedValue) {
      return;
    }
    
    this.isSendCommentLoading = true;

    let input: CommentUpdateInput = {
      commentId: this.comment.id,
      text: this.commentedUpdatedValue,
      videoId: ''
    }

    this.commentService.updateComment(input)
      .subscribe(
        (data: BaseResponse) => {
          this.isSendCommentLoading = false;

          if(data.status == 200) {
            this.comment.text = this.commentedUpdatedValue;
            this.commentIsInEditMode = false;

            var self = this;
            setTimeout(() => {
              self.isShowMoreCommentButtonVisible = self.commentText.nativeElement.scrollHeight != self.commentText.nativeElement.offsetHeight;
              self.commentHasTheClass = self.isShowMoreCommentButtonVisible;
              if (!self.commentHasTheClass) {
                self.commentScrollableHeight = self.commentText.nativeElement.scrollHeight + 'px';
              }
            }, 200);

            this.notificationService.success('Comentariul a fost modificat.');
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

  public deleteComment(): void {
    this.isDeleteCommentLoading = true;
    
    this.commentService.deleteComment(this.comment.id)
      .subscribe(
        (data: BaseResponse) => {
          this.isDeleteCommentLoading = false;

          if(data.status == 200) {
            this.commentWasDeleted = true;
            this.notificationService.info('Comentariul a fost sters.');
          }
          else {
            this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
          }
        },
        error => {
          this.isDeleteCommentLoading = false;
          this.notificationService.fail('Ceva nu a mers bine. Incearca din nou');
        }
      )
  }

  public editComment() {
    this.commentIsInEditMode = true;
  }

  public showMoreComment(): void {
    this.isShowMoreCommentButtonVisible = false;
    this.isShowLessCommentButtonVisible = true;
    this.commentHasTheClass = false;
    
    this.commentScrollableHeight = this.commentText.nativeElement.scrollHeight + 'px';
  }

  public showLessComment(): void {
    this.isShowMoreCommentButtonVisible = true;
    this.isShowLessCommentButtonVisible = false;
    this.commentHasTheClass = true;
    
    this.commentScrollableHeight = null;
  }

  public clickOnComment(): void {
    if (this.commentHasTheClass) {
      this.showMoreComment();
    }
  }

  public goToProducer(producerId: string): void {
    this.utilsService.navigateInSlider('/producer/' + producerId);
  }

}
