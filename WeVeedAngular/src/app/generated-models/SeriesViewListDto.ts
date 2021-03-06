

// $Classes/Enums/Interfaces(filter)[template][separator]
// filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
// template: The template to repeat for each matched item
// separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]

// More info: http://frhagn.github.io/Typewriter/


export class SeriesViewListDto {
    
    public id: string = null;
    public name: string = null;
    public description: string = null;
    public thumbnailUrl: string = null;
    public category: string = null;


    public lastSeason: number = 0;
    public episodesCount: number = 0;


    public followersCount: number = 0;
    public producerId: string = null;
    public producerName: string = null;
    public producerProfileImageUrl: string = null;
}
