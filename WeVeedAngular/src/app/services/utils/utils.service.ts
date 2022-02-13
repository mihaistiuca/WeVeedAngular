import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable, Inject } from '@angular/core';
import { DataService } from '../data/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public playingNowItem: string;
  public timeout;
  public periodArray: string[] = [];

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute) { 
    this.dataService.playingNowItem.subscribe((value: string) => {
      this.playingNowItem = value;
    });

    // this.activatedRoute.params.subscribe(routeParts => {
    //   this.periodArray = [];
    //   debugger;
    //     // for (let i = 1; i < routeParts.length; i++) {
    //     //   this.periodArray.push(routeParts[i].path);
    //     // }
    // });
  }

  public setVolume(value: number): void {
    this.localStorage.setItem('volume', value);
  }

  public getVolume(): number {
    return this.localStorage.getItem('volume');
  }

  public getTest(): string {
    return this.localStorage.getItem('yyy');
  }

  public setTest(value: string): void {
    this.localStorage.setItem('yyy', value);
  }

  public deleteTest(): void {
    this.localStorage.removeItem('yyy');
  }

  public getLastEpisodeInChannel(channelName: string): string {
    return this.localStorage.getItem(channelName + '_lastEpisode');
  }

  public saveLastEpisodeInChannel(channelName: string, videoId: string): void {
    this.localStorage.setItem(channelName + '_lastEpisode', videoId);
  }

  public navigateToSliderNotFound(): void {
    this.router.navigateByUrl(this.playingNowItem + '/not-found');
  }

  public navigateToSliderError(): void {
    this.router.navigateByUrl(this.playingNowItem + '/error');
  }

  public navigateToMain(): void {
    this.router.navigateByUrl(this.playingNowItem + '/channels');
  }

  // IMPORTANT FEATURE
  public navigateInSlider(sliderPath: string): void {
    this.router.navigateByUrl(this.playingNowItem + sliderPath);
  }

  public navigateInPlayer(playNowParam: string): void {
    if (!playNowParam || playNowParam == '') {
      return;
    }

    let currentUrl = this.router.url;
    if (currentUrl.charAt(0) == '/'){
      currentUrl = currentUrl.substr(1);
    }

    currentUrl = currentUrl.substring(currentUrl.indexOf('/') + 1);

    this.router.navigateByUrl('/' + playNowParam + '/' + currentUrl);
  };

  public generateRandomString(isPng: boolean): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    if(isPng){
      return text;
    }
    return text + ".png";
  }

  public debounce(func, wait, immediate, selfObj) {
    var callNow = immediate && !this.timeout;

    clearTimeout(this.timeout);   

    this.timeout = setTimeout(function() {
          this.timeout = null;

          if (!immediate) {
            func(selfObj);
          }
    }, wait);

    if (callNow) func(selfObj);
  };
}
