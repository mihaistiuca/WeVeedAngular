import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCompleteEpListComponent } from './channel-complete-ep-list.component';

describe('ChannelCompleteEpListComponent', () => {
  let component: ChannelCompleteEpListComponent;
  let fixture: ComponentFixture<ChannelCompleteEpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCompleteEpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCompleteEpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
