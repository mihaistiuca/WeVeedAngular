import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../basic-models/BaseResponse';
import { ProducerListViewDto } from '../../generated-models/ProducerListViewDto';
import { HttpClient } from '@angular/common/http';
import { ProducerSeriesDto } from '../../generated-models/ProducerSeriesDto';
import { SearchProducerInput } from '../../generated-models/SearchProducerInput';
import { SearchSeriesInput } from '../../generated-models/SearchSeriesInput';
import { SearchVideoInput } from '../../generated-models/SearchVideoInput';
import { VideoDisplayCarouselDto } from '../../generated-models/VideoDisplayCarouselDto';
import { VideoDisplayUiDto } from '../../generated-models/VideoDisplayUiDto';

@Injectable({
  providedIn: 'root'
})
export class ExploreService {

  constructor(private http: HttpClient) { }


  // PRODUCERS  
  // ------------------------------------------------------------------------------------------------------------------------------
  // Recommended
  public getDiscoverProducers(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducers');
  }

  // New
  public getDiscoverProducersMostRecent(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducersMostRecent');
  }

  // Followed
  // -weekly
  public getDiscoverProducersFollowedWeekly(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducersFollowedWeekly');
  }
  
  // -monthly
  public getDiscoverProducersFollowedMonthly(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducersFollowedMonthly');
  }
  
  // -all time
  public getDiscoverProducersFollowedAllTime(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducersFollowedAllTime');
  }

  // Viewed 
  // -weekly
  public getDiscoverProducersMostViewedWeekly(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducersMostViewedWeekly');
  }
  
  // -monthly
  public getDiscoverProducersMostViewedMonthly(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducersMostViewedMonthly');
  }
  
  // -all time
  public getDiscoverProducersMostViewedAllTime(): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.get<BaseResponse<ProducerListViewDto[]>>('/user/getDiscoverProducersMostViewedAllTime');
  }
  // ------------------------------------------------------------------------------------------------------------------------------

  // SERIES
  // ------------------------------------------------------------------------------------------------------------------------------
  // Recommended
  public getDiscoverSeries(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeries');
  }

  // New
  public getDiscoverMostRecentSeries(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverMostRecentSeries');
  }

  // Followed
  // -weekly
  public getDiscoverSeriesFollowedWeekly(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesFollowedWeekly');
  }

  // -monthly
  public getDiscoverSeriesFollowedMonthly(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesFollowedMonthly');
  }

  // -all time
  public getDiscoverSeriesFollowedAllTime(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesFollowedAllTime');
  }

  // Viewed
  // -weekly
  public getDiscoverSeriesMostViewedWeekly(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesMostViewedWeekly');
  }
  
  // -monthly
  public getDiscoverSeriesMostViewedMonthly(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesMostViewedMonthly');
  }
  
  // -all time
  public getDiscoverSeriesMostViewedAllTime(): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.get<BaseResponse<ProducerSeriesDto[]>>('/series/getDiscoverSeriesMostViewedAllTime');
  }
  // ------------------------------------------------------------------------------------------------------------------------------


  public getDiscoverVideosForChannel(channelName: string): Observable<BaseResponse<VideoDisplayCarouselDto[]>> {
    return this.http.get<BaseResponse<VideoDisplayCarouselDto[]>>('/video/getDiscoverVideos/' + channelName);
  }

  // SEARCH 

  public getSearchProducers(input: SearchProducerInput): Observable<BaseResponse<ProducerListViewDto[]>> {
    return this.http.post<BaseResponse<ProducerListViewDto[]>>('/user/searchProducers', input);
  }

  public getSearchSeries(input: SearchSeriesInput): Observable<BaseResponse<ProducerSeriesDto[]>> {
    return this.http.post<BaseResponse<ProducerSeriesDto[]>>('/series/searchSeries', input);
  }

  public getSearchVideos(input: SearchVideoInput): Observable<BaseResponse<VideoDisplayUiDto[]>> {
    return this.http.post<BaseResponse<VideoDisplayUiDto[]>>('/video/searchVideos', input);
  }
}
