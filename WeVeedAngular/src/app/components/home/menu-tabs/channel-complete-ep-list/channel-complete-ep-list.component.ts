import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../services/utils/utils.service';
import { Constants } from '../../../../constants/Constants';
import { BaseResponse } from '../../../../basic-models/BaseResponse';
import { GetChannelPlayingNowVideoListInput } from '../../../../generated-models/GetChannelPlayingNowVideoListInput';
import { ChannelService } from '../../../../services/channel/channel.service';
import { VideoPlayingNowDto } from '../../../../generated-models/VideoPlayingNowDto';

@Component({
  selector: 'app-channel-complete-ep-list',
  templateUrl: './channel-complete-ep-list.component.html',
  styleUrls: ['./channel-complete-ep-list.component.css']
})
export class ChannelCompleteEpListComponent implements OnInit {

  public channelName: string = null;
  public channelConfig: any = null;
  public channelConfigs: any[];
  public areEpisodesLoading: boolean = true;

  public channelVideosInfo: VideoPlayingNowDto[];

  constructor(private router: ActivatedRoute, private utilsService: UtilsService, private constants: Constants, public channelService: ChannelService) { }

  ngOnInit() {
    this.channelConfigs = this.constants.ChannelsConfig;
    
    this.router.params.subscribe(params => {
      this.channelName = params['channel'];

      if (!this.channelName) {
        this.utilsService.navigateInSlider('/channels');
        return;
      }

      this.channelConfig = this.channelConfigs.find((a) => {
        return a.name == this.channelName;
      });

      this.initEpisodesList();
    });
  }

  public initEpisodesList(): void {

    let input: GetChannelPlayingNowVideoListInput = {
      channelName: this.channelConfig.name,
      playingNowVideoId: null
    };

    this.channelService.getPlayingNowVideoList(input)
     .subscribe(
       (response: BaseResponse<VideoPlayingNowDto[]>) => {
        if (response.status == 200 && response.data) {
          this.channelVideosInfo = response.data;
          this.areEpisodesLoading = false;
        }
        else {
          this.areEpisodesLoading = false;
        }
       },
       error => {
         this.areEpisodesLoading = false;
       }
     )
  }

}
