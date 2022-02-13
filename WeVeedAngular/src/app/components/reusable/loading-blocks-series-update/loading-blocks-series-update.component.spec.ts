import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksSeriesUpdateComponent } from './loading-blocks-series-update.component';

describe('LoadingBlocksSeriesUpdateComponent', () => {
  let component: LoadingBlocksSeriesUpdateComponent;
  let fixture: ComponentFixture<LoadingBlocksSeriesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksSeriesUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksSeriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
