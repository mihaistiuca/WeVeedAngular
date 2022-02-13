import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMychannelErrorContentComponent } from './dialog-mychannel-error-content.component';

describe('DialogMychannelErrorContentComponent', () => {
  let component: DialogMychannelErrorContentComponent;
  let fixture: ComponentFixture<DialogMychannelErrorContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMychannelErrorContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMychannelErrorContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
