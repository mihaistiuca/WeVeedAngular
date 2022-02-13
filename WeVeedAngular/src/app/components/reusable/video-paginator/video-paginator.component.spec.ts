import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPaginatorComponent } from './video-paginator.component';

describe('VideoPaginatorComponent', () => {
  let component: VideoPaginatorComponent;
  let fixture: ComponentFixture<VideoPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
