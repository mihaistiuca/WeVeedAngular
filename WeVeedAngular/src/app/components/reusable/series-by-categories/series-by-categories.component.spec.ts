import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesByCategoriesComponent } from './series-by-categories.component';

describe('SeriesByCategoriesComponent', () => {
  let component: SeriesByCategoriesComponent;
  let fixture: ComponentFixture<SeriesByCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesByCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesByCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
