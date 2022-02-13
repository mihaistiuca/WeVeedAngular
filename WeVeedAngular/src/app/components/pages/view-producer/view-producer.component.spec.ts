import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProducerComponent } from './view-producer.component';

describe('ViewProducerComponent', () => {
  let component: ViewProducerComponent;
  let fixture: ComponentFixture<ViewProducerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProducerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
