import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, IdResponse } from '../../basic-models/BaseResponse';
import { VideoCreateInput } from '../../generated-models/VideoCreateInput';
import { VideoDisplayCarouselDto } from '../../generated-models/VideoDisplayCarouselDto';
import { AllVideoPaginateInput } from '../../generated-models/AllVideoPaginateInput';
import { VideoDisplayUiDto } from '../../generated-models/VideoDisplayUiDto';
import { VideoUpdateDto } from '../../generated-models/VideoUpdateDto';
import { VideoUpdateInput } from '../../generated-models/VideoUpdateInput';
import { VideoWatchDto } from '../../generated-models/VideoWatchDto';
import { PingInput } from '../../generated-models/PingInput';
import { VideoPlayingNowDto } from '../../generated-models/VideoPlayingNowDto';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) { }

// -----------------------------------------------------------------------
// for series
  public getAllSeriesPaginated(seriesId: string, input: AllVideoPaginateInput): Observable<BaseResponse<VideoDisplayUiDto[]>> {
    return this.http.post<BaseResponse<VideoDisplayUiDto[]>>('/video/getAllSeriesPaginated/' + seriesId, input);
  }

  public getMostViewedBySeries(seriesId: string): Observable<BaseResponse<VideoDisplayCarouselDto[]>> {
    return this.http.get<BaseResponse<VideoDisplayCarouselDto[]>>('/video/getMostViewedBySeries/' + seriesId);
  }
// -----------------------------------------------------------------------


// -----------------------------------------------------------------------
// for producer
  public getAllProducerPaginated(input: AllVideoPaginateInput): Observable<BaseResponse<VideoDisplayUiDto[]>> {
    return this.http.post<BaseResponse<VideoDisplayUiDto[]>>('/video/getAllProducerPaginated', input);
  }

  public getMostViewedByProducer(): Observable<BaseResponse<VideoDisplayCarouselDto[]>> {
    return this.http.get<BaseResponse<VideoDisplayCarouselDto[]>>('/video/getMostViewedByProducer');
  }

// for producer page 
  public getAllOtherProducerPaginated(producerId: string, input: AllVideoPaginateInput): Observable<BaseResponse<VideoDisplayUiDto[]>> {
    return this.http.post<BaseResponse<VideoDisplayUiDto[]>>('/video/getAllOtherProducerPaginated/' + producerId, input);
  }

  public GetMostViewedByOtherProducer(producerId: string): Observable<BaseResponse<VideoDisplayCarouselDto[]>> {
    return this.http.get<BaseResponse<VideoDisplayCarouselDto[]>>('/video/getMostViewedByOtherProducer/' + producerId);
  }
// -----------------------------------------------------------------------

  public getWatchDtoById(id: string): Observable<BaseResponse<VideoWatchDto>> {
    return this.http.get<BaseResponse<VideoWatchDto>>('/video/getWatchDtoById/' + id);
  }

  public getPlayingNowById(id: string): Observable<BaseResponse<VideoPlayingNowDto>> {
    return this.http.get<BaseResponse<VideoPlayingNowDto>>('/video/getPlayingNowVideoById/' + id);
  }

  public getUpdateDtoById(id: string): Observable<BaseResponse<VideoUpdateDto>> {
    return this.http.get<BaseResponse<VideoUpdateDto>>('/video/getUpdateDtoById/' + id);
  }

  public create(input: VideoCreateInput): Observable<BaseResponse<IdResponse>> {
    return this.http.post<BaseResponse<IdResponse>>('/video/create', input);
  }

  public updateVideo(input: VideoUpdateInput): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>('/video/update', input);
  }

  public delete(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>('/video/delete/' + id);
  }

  public ping(input: PingInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/video/ping', input);
  }


  // explore screen - videos by categories 
  // Recommended
  public getDiscoverExploreVideosByCategory(category: string): Observable<BaseResponse<VideoDisplayUiDto[]>> {
    return this.http.get<BaseResponse<VideoDisplayUiDto[]>>('/video/getDiscoverExploreVideosByCategory/' + category);
  }

  // New
  public getDiscoverExploreMostRecentVideosByCategory(category: string): Observable<BaseResponse<VideoDisplayUiDto[]>> {
    return this.http.get<BaseResponse<VideoDisplayUiDto[]>>('/video/getDiscoverExploreMostRecentVideosByCategory/' + category);
  }

  // Viewed
  // -all time
  public getDiscoverExploreMostViewedVideosByCategory(category: string): Observable<BaseResponse<VideoDisplayUiDto[]>> {
    return this.http.get<BaseResponse<VideoDisplayUiDto[]>>('/video/getDiscoverExploreMostViewedVideosByCategory/' + category);
  }
}
