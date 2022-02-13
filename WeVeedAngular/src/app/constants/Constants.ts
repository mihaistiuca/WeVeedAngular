
export class Constants {
    public GeneralChannel: string = "general";
    public EntertainmentChannel: string = "entertainment";
    public EducationalChannel: string = "educational";
    public NewsChannel: string = "news";
    public TechChannel: string = "tech";
    public TravelChannel: string = "travel";
    public FashionChannel: string = "fashion";
    public SportChannel: string = "sport";
    public KidsChannel: string = "kids";
    public CookingChannel: string = "cooking";
    public AutomotoChannel: string = "automoto";
    public GamingChannel: string = "gaming";
    public MusicChannel : string= "music";
    public VlogChannel: string = "vlog";
    public MyChannel: string = "mychannel";

    public AllChannelsList: string[] = [
        this.GeneralChannel,
        this.EntertainmentChannel,
        this.EducationalChannel,
        this.NewsChannel,
        this.TechChannel,
        this.TravelChannel,
        this.FashionChannel,
        this.SportChannel,
        this.KidsChannel,
        this.CookingChannel,
        this.AutomotoChannel,
        this.GamingChannel,
        this.MusicChannel,
        this.VlogChannel
    ];

    public AllNichedChannelsList: string[] = [
        this.EntertainmentChannel,
        this.EducationalChannel,
        this.NewsChannel,
        this.TechChannel,
        this.TravelChannel,
        this.FashionChannel,
        this.SportChannel,
        this.KidsChannel,
        this.CookingChannel,
        this.AutomotoChannel,
        this.GamingChannel,
        this.MusicChannel,
        this.VlogChannel
    ];

    public videoThumbHeight: number = 88;
    public videoThumbWidth: number = 160;
    public videoThumbProgressSeconds: number = 5;

    public channelNamingMapping = {
        general: 'General',
        entertainment: 'Divertisment',
        educational: 'Educational',
        news: 'Stiri',
        tech: 'Tech',
        travel: 'Travel',
        fashion: 'Beauty & Fashion',
        sport: 'Sport',
        kids: 'Kids',
        cooking: 'Cooking',
        automoto: 'Auto-Moto',
        gaming: 'gaming',
        music: 'Muzica',
        vlog: 'Vlog',
        mychannel: 'Meu'
    }

    public NichedChannelsConfig = [
        {
            name: 'entertainment',
            roName: 'divertisment',
            capitalName: 'Entertainment',
            capitalRoName: 'Divertisment',
            thumbnailText: 'DIVERTISMENT',
        },
        {
            name: 'educational',
            roName: 'educational',
            capitalName: 'Educational',
            capitalRoName: 'Educational',
            thumbnailText: 'EDUCATIONAL',
        },
        {
            name: 'news',
            roName: 'stiri',
            capitalName: 'News',
            capitalRoName: 'Stiri',
            thumbnailText: 'STIRI',
        },
        {
            name: 'tech',
            roName: 'tech',
            capitalName: 'Tech',
            capitalRoName: 'Tech',
            thumbnailText: 'TECH',
        },
        {
            name: 'travel',
            roName: 'travel',
            capitalName: 'Travel',
            capitalRoName: 'Travel',
            thumbnailText: 'TRAVEL',
        },
        {
            name: 'fashion',
            roName: 'beauty & fashion',
            capitalName: 'Beauty & Fashion',
            capitalRoName: 'Beauty & Fashion',
            thumbnailText: 'BEAUTY & FASHION',
        },
        {
            name: 'sport',
            roName: 'sport',
            capitalName: 'Sport',
            capitalRoName: 'Sport',
            thumbnailText: 'SPORT',
        },
        {
            name: 'kids',
            roName: 'kids',
            capitalName: 'Kids',
            capitalRoName: 'Kids',
            thumbnailText: 'KIDS',
        },
        {
            name: 'cooking',
            roName: 'cooking',
            capitalName: 'Cooking',
            capitalRoName: 'Cooking',
            thumbnailText: 'COOKING',
        },
        {
            name: 'automoto',
            roName: 'auto-moto',
            capitalName: 'Automoto',
            capitalRoName: 'Automoto',
            thumbnailText: 'AUTOMOTO',
        },
        {
            name: 'gaming',
            roName: 'gaming',
            capitalName: 'Gaming',
            capitalRoName: 'Gaming',
            thumbnailText: 'GAMING',
        },
        {
            name: 'music',
            roName: 'muzica',
            capitalName: 'Music',
            capitalRoName: 'Muzica',
            thumbnailText: 'MUZICA',
        },
        {
            name: 'vlog',
            roName: 'vlog',
            capitalName: 'Vlog',
            capitalRoName: 'Vlog',
            thumbnailText: 'VLOG',
        },
    ]

    public ChannelsConfig = [
        {
            name: 'general',
            roName: 'general',
            capitalName: 'General',
            capitalRoName: 'General',
            thumbnailText: 'GENERAL',
            iconName: 'tv',
            iconType: 'fas'
        },
        {
            name: 'entertainment',
            roName: 'divertisment',
            capitalName: 'Entertainment',
            capitalRoName: 'Divertisment',
            thumbnailText: 'DIVERTISMENT',
            iconName: 'smile',
            iconType: 'far'
        },
        {
            name: 'educational',
            roName: 'educational',
            capitalName: 'Educational',
            capitalRoName: 'Educational',
            thumbnailText: 'EDUCATIONAL',
            iconName: 'university',
            iconType: 'fas'
        },
        {
            name: 'travel',
            roName: 'travel',
            capitalName: 'Travel',
            capitalRoName: 'Travel',
            thumbnailText: 'TRAVEL',
            iconName: 'plane-departure',
            iconType: 'fas'
        },
        {
            name: 'automoto',
            roName: 'auto-moto',
            capitalName: 'Automoto',
            capitalRoName: 'AutoMoto',
            thumbnailText: 'AUTOMOTO',
            iconName: 'car',
            iconType: 'fas'
        },
        {
            name: 'sport',
            roName: 'sport',
            capitalName: 'Sport',
            capitalRoName: 'Sport',
            thumbnailText: 'SPORT',
            iconName: 'basketball-ball',
            iconType: 'fas'
        },
        {
            name: 'tech',
            roName: 'tech',
            capitalName: 'Tech',
            capitalRoName: 'Tech',
            thumbnailText: 'TECH',
            iconName: 'laptop',
            iconType: 'fas'
        },
        {
            name: 'fashion',
            roName: 'beauty & fashion',
            capitalName: 'Beauty & Fashion',
            capitalRoName: 'Beauty & Fashion',
            thumbnailText: 'BEAUTY & FASHION',
            iconName: 'tshirt',
            iconType: 'fas'
        },
        {
            name: 'music',
            roName: 'muzica',
            capitalName: 'Music',
            capitalRoName: 'Muzica',
            thumbnailText: 'MUZICA',
            iconName: 'music',
            iconType: 'fas'
        },
        {
            name: 'gaming',
            roName: 'gaming',
            capitalName: 'Gaming',
            capitalRoName: 'Gaming',
            thumbnailText: 'GAMING',
            iconName: 'headset',
            iconType: 'fas'
        },
        {
            name: 'cooking',
            roName: 'cooking',
            capitalName: 'Cooking',
            capitalRoName: 'Cooking',
            thumbnailText: 'COOKING',
            iconName: 'utensils',
            iconType: 'fas'
        },
        {
            name: 'news',
            roName: 'stiri',
            capitalName: 'News',
            capitalRoName: 'Stiri',
            thumbnailText: 'STIRI',
            iconName: 'newspaper',
            iconType: 'far'
        },
        {
            name: 'kids',
            roName: 'kids',
            capitalName: 'Kids',
            capitalRoName: 'Kids',
            thumbnailText: 'KIDS',
            iconName: 'child',
            iconType: 'fas'
        },
        {
            name: 'vlog',
            roName: 'vlog',
            capitalName: 'Vlog',
            capitalRoName: 'Vlog',
            thumbnailText: 'VLOG',
            iconName: 'video',
            iconType: 'fas'
        },
    ]
}
