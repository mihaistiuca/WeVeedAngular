import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksPlayingNowNextComponent } from './loading-blocks-playing-now-next.component';

describe('LoadingBlocksPlayingNowNextComponent', () => {
  let component: LoadingBlocksPlayingNowNextComponent;
  let fixture: ComponentFixture<LoadingBlocksPlayingNowNextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksPlayingNowNextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksPlayingNowNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
