import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksPlayingNowMainComponent } from './loading-blocks-playing-now-main.component';

describe('LoadingBlocksPlayingNowMainComponent', () => {
  let component: LoadingBlocksPlayingNowMainComponent;
  let fixture: ComponentFixture<LoadingBlocksPlayingNowMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksPlayingNowMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksPlayingNowMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
