import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksProfileComponent } from './loading-blocks-profile.component';

describe('LoadingBlocksProfileComponent', () => {
  let component: LoadingBlocksProfileComponent;
  let fixture: ComponentFixture<LoadingBlocksProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
