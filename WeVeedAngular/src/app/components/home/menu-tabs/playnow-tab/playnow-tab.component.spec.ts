import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaynowTabComponent } from './playnow-tab.component';

describe('PlaynowTabComponent', () => {
  let component: PlaynowTabComponent;
  let fixture: ComponentFixture<PlaynowTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaynowTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaynowTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
