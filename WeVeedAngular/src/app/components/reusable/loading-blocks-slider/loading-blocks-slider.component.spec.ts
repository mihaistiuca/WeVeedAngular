import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksSliderComponent } from './loading-blocks-slider.component';

describe('LoadingBlocksSliderComponent', () => {
  let component: LoadingBlocksSliderComponent;
  let fixture: ComponentFixture<LoadingBlocksSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
