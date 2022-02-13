import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaynowInformationComponent } from './playnow-information.component';

describe('PlaynowInformationComponent', () => {
  let component: PlaynowInformationComponent;
  let fixture: ComponentFixture<PlaynowInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaynowInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaynowInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
