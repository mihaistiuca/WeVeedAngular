import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsTabCommentComponent } from './comments-tab-comment.component';

describe('CommentsTabCommentComponent', () => {
  let component: CommentsTabCommentComponent;
  let fixture: ComponentFixture<CommentsTabCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsTabCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsTabCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
