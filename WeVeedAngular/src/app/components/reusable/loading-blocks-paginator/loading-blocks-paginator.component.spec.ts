import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksPaginatorComponent } from './loading-blocks-paginator.component';

describe('LoadingBlocksPaginatorComponent', () => {
  let component: LoadingBlocksPaginatorComponent;
  let fixture: ComponentFixture<LoadingBlocksPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
