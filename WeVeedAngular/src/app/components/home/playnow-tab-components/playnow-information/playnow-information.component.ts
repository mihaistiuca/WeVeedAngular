import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playnow-information',
  templateUrl: './playnow-information.component.html',
  styleUrls: ['./playnow-information.component.css']
})
export class PlaynowInformationComponent implements OnInit {

  public series: string;
  public description: string;
  public season: number;
  public episode: number;
  public views: number;
  public producerName: string;
  public producerFollowers: number;

  constructor() { 
    this.description = "mihai";
    this.series = "BRO Mama";
    this.season = 1;
    this.episode = 1;
    this.views = 123252;
    this.producerName = "BRomania";
    this.producerFollowers = 19243;
  }
  
  ngOnInit() {
  }

}
