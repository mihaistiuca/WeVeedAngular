import { bool } from "aws-sdk/clients/signer";

export class SliderInfo {
    
    elements: ElementInfo[];
    isSeries: boolean = false;
    isVideo: boolean = false;
}

export class ElementInfo {
    
    // common 
    public id: string;
    public name: string;
    public description: string;
    public imgSrc: string;
    public redirectUrl: string;

    // for series 
    public seriesCategory: string;
    public followersCount: number;
    public producerId: string;
    public producerName: string;
    public producerProfileImageUrl: string; 
    public lastSeason: number;
    public episodesCount: number;

    // for video
    public episode: number;
    public season: number;
    public parentSeriesName: string;
    public parentSeriesThumbnailUrl: string;
    public videoProducerId: string;
    public videoBelongsToCurrentUser: boolean;
    public updateVideoPageUrl: string;
    public deleteVideoPageUrl: string;
    public length: number;
    public numberOfViews: number;
    // for video - IMPORTANT
    public wasEncoded: boolean;

    // for video - TO BE ABLE TO OPEN CHANNEL FROM CHANNELS TAB 
    public videoCategory: string;
}