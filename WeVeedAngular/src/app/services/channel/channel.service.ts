import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetChannelVideoInput } from '../../generated-models/GetChannelVideoInput';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../basic-models/BaseResponse';
import { VideoWatchDto } from '../../generated-models/VideoWatchDto';
import { GetChannelNextVideoInput } from '../../generated-models/GetChannelNextVideoInput';
import { VideoPlayingNowDto } from '../../generated-models/VideoPlayingNowDto';
import { GetChannelPlayingNowVideoListInput } from '../../generated-models/GetChannelPlayingNowVideoListInput';
import { GetMyChannelVideoInput } from '../../generated-models/GetMyChannelVideoInput';
import { GetMyChannelNextVideoInput } from '../../generated-models/GetMyChannelNextVideoInput';
import { GetMyChannelPlayingNowVideoListInput } from '../../generated-models/GetMyChannelPlayingNowVideoListInput';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }
  
  public getPlayingNowVideoList(input: GetChannelPlayingNowVideoListInput): Observable<BaseResponse<VideoPlayingNowDto[]>> {
    return this.http.post<BaseResponse<VideoPlayingNowDto[]>>('/channel/getPlayingNowVideoList', input);
  }
  
  public getChannelVideo(input: GetChannelVideoInput): Observable<BaseResponse<VideoWatchDto>> {
    return this.http.post<BaseResponse<VideoWatchDto>>('/channel/getChannelVideo', input);
  }
  
  public getChannelNextVideo(input: GetChannelNextVideoInput): Observable<BaseResponse<VideoWatchDto>> {
    return this.http.post<BaseResponse<VideoWatchDto>>('/channel/getChannelNextVideo', input);
  }
  
  public getChannelPreviousVideo(input: GetChannelNextVideoInput): Observable<BaseResponse<VideoWatchDto>> {
    return this.http.post<BaseResponse<VideoWatchDto>>('/channel/getChannelPreviousVideo', input);
  }
  
  public getMyChannelVideo(input: GetMyChannelVideoInput): Observable<BaseResponse<VideoWatchDto>> {
    return this.http.post<BaseResponse<VideoWatchDto>>('/channel/getMyChannelVideo', input);
  }
  
  public getMyChannelNextVideo(input: GetMyChannelNextVideoInput): Observable<BaseResponse<VideoWatchDto>> {
    return this.http.post<BaseResponse<VideoWatchDto>>('/channel/getMyChannelNextVideo', input);
  }
  
  public getMyChannelPreviousVideo(input: GetMyChannelNextVideoInput): Observable<BaseResponse<VideoWatchDto>> {
    return this.http.post<BaseResponse<VideoWatchDto>>('/channel/getMyChannelPreviousVideo', input);
  }
  
  public getMyChannelPlayingNowVideoList(input: GetMyChannelPlayingNowVideoListInput): Observable<BaseResponse<VideoPlayingNowDto[]>> {
    return this.http.post<BaseResponse<VideoPlayingNowDto[]>>('/channel/getMyChannelPlayingNowVideoList', input);
  }
  
  public get3EpisodesForEachChannel(): Observable<BaseResponse<any[]>> {
    return this.http.get<BaseResponse<any[]>>('/channel/get3EpisodesForEachChannel');
  }
}
