import { Component, OnInit, Input } from '@angular/core';
import { PaginatorInfo } from './PaginatorInfo';

@Component({
  selector: 'app-video-paginator',
  templateUrl: './video-paginator.component.html',
  styleUrls: ['./video-paginator.component.css']
})
export class VideoPaginatorComponent implements OnInit {

  @Input() paginatorInfo: PaginatorInfo;
  @Input() PaginatorIsInProducerProfile: boolean;

  constructor() { }

  ngOnInit() {
  }

}
