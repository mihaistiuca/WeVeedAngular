import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Input() icon: string;
  @Input() title: string;
  @Input() description: string;
}
