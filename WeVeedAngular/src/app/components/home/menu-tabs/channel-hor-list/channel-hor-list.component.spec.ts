import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelHorListComponent } from './channel-hor-list.component';

describe('ChannelHorListComponent', () => {
  let component: ChannelHorListComponent;
  let fixture: ComponentFixture<ChannelHorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelHorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelHorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
