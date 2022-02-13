import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountProducerComponent } from './my-account-producer.component';

describe('MyAccountProducerComponent', () => {
  let component: MyAccountProducerComponent;
  let fixture: ComponentFixture<MyAccountProducerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAccountProducerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
