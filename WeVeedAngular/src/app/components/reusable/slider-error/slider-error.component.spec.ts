import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderErrorComponent } from './slider-error.component';

describe('SliderErrorComponent', () => {
  let component: SliderErrorComponent;
  let fixture: ComponentFixture<SliderErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
