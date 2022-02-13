import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderNotFoundComponent } from './slider-not-found.component';

describe('SliderNotFoundComponent', () => {
  let component: SliderNotFoundComponent;
  let fixture: ComponentFixture<SliderNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
