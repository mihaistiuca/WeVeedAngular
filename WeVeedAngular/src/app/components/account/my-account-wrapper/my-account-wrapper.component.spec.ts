import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountWrapperComponent } from './my-account-wrapper.component';

describe('MyAccountWrapperComponent', () => {
  let component: MyAccountWrapperComponent;
  let fixture: ComponentFixture<MyAccountWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAccountWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
