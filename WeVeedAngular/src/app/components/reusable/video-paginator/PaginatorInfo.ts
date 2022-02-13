import { ElementInfo } from "../images-slider/SliderInfo";
import { VideoPlayingNowDto } from "../../../generated-models/VideoPlayingNowDto";
import { VideoDisplayUiDto } from "../../../generated-models/VideoDisplayUiDto";

export class PaginatorInfo {
    public halfCardElements: VideoDisplayUiDto[];
    public paginatorIsInProducerProfile: boolean;
}

export class PaginatorElement {
    
    public id: string = null;
    public title: string = null;
    public season: number = null;
    public episode: number = null;
    public thumbnailUrl: string = null;
    public length: number = 0;
    public numberOfViews: number = 0;
    public numberOfLikes: number = 0;
    public seriesId: string = null;
    public seriesName: string = null;
    public seriesThumbnail: string = null;

    public redirectUrl: string = null;
}