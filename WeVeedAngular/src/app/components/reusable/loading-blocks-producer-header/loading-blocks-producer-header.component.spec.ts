import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBlocksProducerHeaderComponent } from './loading-blocks-producer-header.component';

describe('LoadingBlocksProducerHeaderComponent', () => {
  let component: LoadingBlocksProducerHeaderComponent;
  let fixture: ComponentFixture<LoadingBlocksProducerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBlocksProducerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBlocksProducerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
