import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksConfirmTextComponent } from './loading-blocks-confirm-text.component';

describe('LoadingBlocksConfirmTextComponent', () => {
  let component: LoadingBlocksConfirmTextComponent;
  let fixture: ComponentFixture<LoadingBlocksConfirmTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksConfirmTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksConfirmTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
