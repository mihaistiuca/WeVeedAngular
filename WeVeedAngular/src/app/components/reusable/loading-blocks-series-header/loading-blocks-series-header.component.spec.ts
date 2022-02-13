import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksSeriesHeaderComponent } from './loading-blocks-series-header.component';

describe('LoadingBlocksSeriesHeaderComponent', () => {
  let component: LoadingBlocksSeriesHeaderComponent;
  let fixture: ComponentFixture<LoadingBlocksSeriesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksSeriesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksSeriesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
