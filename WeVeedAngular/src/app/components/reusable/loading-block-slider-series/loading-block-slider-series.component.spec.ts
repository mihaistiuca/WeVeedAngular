import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlockSliderSeriesComponent } from './loading-block-slider-series.component';

describe('LoadingBlockSliderSeriesComponent', () => {
  let component: LoadingBlockSliderSeriesComponent;
  let fixture: ComponentFixture<LoadingBlockSliderSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlockSliderSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlockSliderSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
