import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IsSeriesNameUniqueCreateInput } from '../../generated-models/IsSeriesNameUniqueInput';
import { SeriesCreateInput } from '../../generated-models/SeriesCreateInput';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../basic-models/BaseResponse';
import { ProducerSeriesDto } from '../../generated-models/ProducerSeriesDto';
import { SeriesLastEpisodeDto } from '../../generated-models/SeriesLastEpisodeDto';
import { SeriesViewDto } from '../../generated-models/SeriesViewDto';
import { SeriesUpdateDto } from '../../generated-models/SeriesUpdateDto';
import { SeriesUpdateInput } from '../../generated-models/SeriesUpdateInput';
import { IsSeriesNameUniqueUpdateInput } from '../../generated-models/IsSeriesNameUniqueUpdateInput';
import { SeriesFollowInput } from '../../generated-models/SeriesFollowInput';
import { SeriesViewListDto } from '../../generated-models/SeriesViewListDto';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private http: HttpClient) { }

  public getMyFollowedSeries(): Observable<BaseResponse<SeriesViewListDto[]>> {
    return this.http.get<BaseResponse<SeriesViewListDto[]>>('/series/getMyFollowedSeries');
  }

  public getUpdateDtoById(id: string): Observable<BaseResponse<SeriesUpdateDto>> {
    return this.http.get<BaseResponse<SeriesViewDto>>('/series/getUpdateDtoById/' + id);
  }

  public getViewById(id: string): Observable<BaseResponse<SeriesViewDto>> {
    return this.http.get<BaseResponse<SeriesViewDto>>('/series/getViewById/' + id);
  }

  public getAllProducer(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getAllProducer');
  }

  public getAllOtherProducer(producerId: string): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getAllOtherProducer/' + producerId);
  }

  public getAllWithLastEpisodes(): Observable<BaseResponse<SeriesLastEpisodeDto[]>> {
    return this.http.get<BaseResponse<SeriesLastEpisodeDto[]>>('/series/getAllWithLastEpisodes');
  }

  public seriesExistWithLastEpisodes(seriesId: string): Observable<BaseResponse<SeriesLastEpisodeDto>> {
    return this.http.get<BaseResponse<SeriesLastEpisodeDto>>('/series/seriesExistWithLastEpisodes/' + seriesId);
  }

  public isSeriesNameUniqueCreate(input: IsSeriesNameUniqueCreateInput): any {
    return this.http.post('/series/isSeriesNameUniqueCreate', input);
  }

  public isSeriesNameUniqueUpdate(input: IsSeriesNameUniqueUpdateInput): any {
    return this.http.post('/series/isSeriesNameUniqueUpdate', input);
  }

  public createSeries(input: SeriesCreateInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/series/create', input);
  }

  public updateSeries(input: SeriesUpdateInput): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>('/series/update', input);
  }

  public delete(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>('/series/delete/' + id);
  }

  public follow(input: SeriesFollowInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/series/followSeries', input);
  }

  public unfollow(input: SeriesFollowInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/series/unfollowSeries', input);
  }


  // explore screen - series by categories 
  // Recommended
  public getDiscoverVideosByCategory(category: string): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverVideosByCategory/' + category);
  }

  // New
  public getDiscoverMostRecentSeriesByCategory(category: string): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverMostRecentSeriesByCategory/' + category);
  }

  // Followed
  // -all time
  public getDiscoverSeriesFollowedAllTimeByCategory(category: string): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesFollowedAllTimeByCategory/' + category);
  }

  // Viewed
  // -all time
  public getDiscoverSeriesMostViewedAllTimeByCategory(category: string): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesMostViewedAllTimeByCategory/' + category);
  }
}
