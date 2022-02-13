import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerSliderComponent } from './producer-slider.component';

describe('ProducerSliderComponent', () => {
  let component: ProducerSliderComponent;
  let fixture: ComponentFixture<ProducerSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
