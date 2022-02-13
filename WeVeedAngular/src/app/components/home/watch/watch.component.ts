import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../services/utils/utils.service';
import { Constants } from '../../../constants/Constants';
import { VideoService } from '../../../services/video/video.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {
  
  @ViewChild('videoPlayer') videoPlayer: any;
  public videoSrc: string;

  public isVideoLargeScreen: boolean = false;

  public playNowItem: string;

  public contentIsVideo: boolean = false;
  public contentIsChannel: boolean = false;
  public contentIsMyChannel: boolean = false;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private utilsService: UtilsService,
    private videoService: VideoService, private constants: Constants) {
      this.videoSrc = 'http://techslides.com/demos/sample-videos/small.mp4#t=10';
   }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.playNowItem = params['playing'];

      this.contentIsChannel = false;
      this.contentIsVideo = false;
      this.contentIsMyChannel = false;

      if (this.constants.AllChannelsList.includes(this.playNowItem)) {
        this.contentIsChannel = true;
        this.dataService.changeVideoPlayingNowItem(null);
        this.dataService.changeMyChannelPlayingNowVideo(null);
        this.dataService.changeChannelVideoPlayingNowItem(this.playNowItem);
      }
      else if (this.playNowItem == 'mychannel') {
        this.contentIsMyChannel = true;

      }
      else {
        this.contentIsVideo = true;
        this.dataService.changeMyChannelPlayingNowVideo(null);
        this.dataService.changeChannelVideoPlayingNowItem(null);
        this.dataService.changeChannelVideoIdPlayNow(null);
        this.dataService.changeChannelVideoPlayingNowDiffItem(null);
        this.dataService.changeVideoPlayingNowItem(this.playNowItem);
      }
    });
  }

  public handleToggleOnMenuBtn() {
    this.isVideoLargeScreen = !this.isVideoLargeScreen;
    this.dataService.changeIsVideoLargeScreen(this.isVideoLargeScreen);
  }

}
