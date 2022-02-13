import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProducerConditionsComponent } from './dialog-producer-conditions.component';

describe('DialogProducerConditionsComponent', () => {
  let component: DialogProducerConditionsComponent;
  let fixture: ComponentFixture<DialogProducerConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogProducerConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProducerConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
