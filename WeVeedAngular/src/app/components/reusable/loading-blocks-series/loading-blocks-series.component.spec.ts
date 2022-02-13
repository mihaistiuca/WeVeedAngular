import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksSeriesComponent } from './loading-blocks-series.component';

describe('LoadingBlocksSeriesComponent', () => {
  let component: LoadingBlocksSeriesComponent;
  let fixture: ComponentFixture<LoadingBlocksSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
