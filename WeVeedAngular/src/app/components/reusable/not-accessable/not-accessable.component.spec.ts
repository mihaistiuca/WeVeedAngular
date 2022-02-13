import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAccessableComponent } from './not-accessable.component';

describe('NotAccessableComponent', () => {
  let component: NotAccessableComponent;
  let fixture: ComponentFixture<NotAccessableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAccessableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAccessableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
