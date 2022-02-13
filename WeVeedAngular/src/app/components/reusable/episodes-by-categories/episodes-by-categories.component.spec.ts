import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesByCategoriesComponent } from './episodes-by-categories.component';

describe('EpisodesByCategoriesComponent', () => {
  let component: EpisodesByCategoriesComponent;
  let fixture: ComponentFixture<EpisodesByCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodesByCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodesByCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
