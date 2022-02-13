import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksMyFollowingsComponent } from './loading-blocks-my-followings.component';

describe('LoadingBlocksMyFollowingsComponent', () => {
  let component: LoadingBlocksMyFollowingsComponent;
  let fixture: ComponentFixture<LoadingBlocksMyFollowingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksMyFollowingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksMyFollowingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
