import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksCommentsComponent } from './loading-blocks-comments.component';

describe('LoadingBlocksCommentsComponent', () => {
  let component: LoadingBlocksCommentsComponent;
  let fixture: ComponentFixture<LoadingBlocksCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
