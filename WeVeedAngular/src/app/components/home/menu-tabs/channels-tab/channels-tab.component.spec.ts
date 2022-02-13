import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsTabComponent } from './channels-tab.component';

describe('ChannelsTabComponent', () => {
  let component: ChannelsTabComponent;
  let fixture: ComponentFixture<ChannelsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
