import { Injectable } from '@angular/core';
import { CommentCreateInput } from '../../generated-models/CommentCreateInput';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../basic-models/BaseResponse';
import { HttpClient } from '@angular/common/http';
import { CommentDisplayUiDto } from '../../generated-models/CommentDisplayUiDto';
import { VideoCommentPaginationInput } from '../../generated-models/VideoCommentPaginationInput';
import { CommentUpdateInput } from 'src/app/generated-models/CommentUpdateInput';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  public createComment(input: CommentCreateInput): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>('/comment/create', input);
  }

  public updateComment(input: CommentUpdateInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/comment/update', input);
  }

  public deleteComment(commentId: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>('/comment/delete/' + commentId);
  }

  public getAllByVideoPaginated(input: VideoCommentPaginationInput): Observable<BaseResponse<CommentDisplayUiDto[]>> {
    return this.http.post<BaseResponse<CommentDisplayUiDto[]>>('/comment/getAllByVideoPaginated', input);
  }

}
