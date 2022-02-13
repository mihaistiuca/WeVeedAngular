import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordSendEmailComponent } from './reset-password-send-email.component';

describe('ResetPasswordSendEmailComponent', () => {
  let component: ResetPasswordSendEmailComponent;
  let fixture: ComponentFixture<ResetPasswordSendEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordSendEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
