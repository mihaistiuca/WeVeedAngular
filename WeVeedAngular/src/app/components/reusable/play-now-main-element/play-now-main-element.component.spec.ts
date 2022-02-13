import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowMainElementComponent } from './play-now-main-element.component';

describe('PlayNowMainElementComponent', () => {
  let component: PlayNowMainElementComponent;
  let fixture: ComponentFixture<PlayNowMainElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayNowMainElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayNowMainElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
