import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNouserContentComponent } from './dialog-nouser-content.component';

describe('DialogNouserContentComponent', () => {
  let component: DialogNouserContentComponent;
  let fixture: ComponentFixture<DialogNouserContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogNouserContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNouserContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
