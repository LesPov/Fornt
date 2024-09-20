import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPhoneComponent } from './verify-phone.component';

describe('VerifyPhoneComponent', () => {
  let component: VerifyPhoneComponent;
  let fixture: ComponentFixture<VerifyPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyPhoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
