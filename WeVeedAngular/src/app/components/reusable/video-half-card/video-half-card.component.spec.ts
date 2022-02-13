import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoHalfCardComponent } from './video-half-card.component';

describe('VideoHalfCardComponent', () => {
  let component: VideoHalfCardComponent;
  let fixture: ComponentFixture<VideoHalfCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoHalfCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoHalfCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
