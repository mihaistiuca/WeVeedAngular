import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUssComponent } from './about-uss.component';

describe('AboutUssComponent', () => {
  let component: AboutUssComponent;
  let fixture: ComponentFixture<AboutUssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutUssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
