import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksSearchProducersComponent } from './loading-blocks-search-producers.component';

describe('LoadingBlocksSearchProducersComponent', () => {
  let component: LoadingBlocksSearchProducersComponent;
  let fixture: ComponentFixture<LoadingBlocksSearchProducersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksSearchProducersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksSearchProducersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
