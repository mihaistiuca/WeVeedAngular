import { Component, OnInit, Input } from '@angular/core';
import { ChannelService } from '../../../../services/channel/channel.service';
import { GetChannelPlayingNowVideoListInput } from '../../../../generated-models/GetChannelPlayingNowVideoListInput';
import { BaseResponse } from '../../../../basic-models/BaseResponse';
import { VideoPlayingNowDto } from '../../../../generated-models/VideoPlayingNowDto';
import { SliderInfo, ElementInfo } from '../../../reusable/images-slider/SliderInfo';
import { UtilsService } from '../../../../services/utils/utils.service';
import { DataService } from '../../../../services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-hor-list',
  templateUrl: './channel-hor-list.component.html',
  styleUrls: ['./channel-hor-list.component.css']
})
export class ChannelHorListComponent implements OnInit {

  @Input() channelConfig = null;
  @Input() sliderVideosInfo = null;
  @Input() isChannelVideosLoading = true;
  
  public sliderVideoInfo: SliderInfo;

  constructor(private channelService: ChannelService, private utilsService: UtilsService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  public goToSeeAllChannelEpisodes(): void {
    this.utilsService.navigateInSlider('/channel-program/' + this.channelConfig.name);
  }

  public playChannel(): void {
    this.dataService.changeWaitForThisChannelEventInPlayNow(this.channelConfig.name);
    setTimeout(() => {
      this.router.navigateByUrl('/' + this.channelConfig.name + '/playnow');  
    }, 20);
  }

}
