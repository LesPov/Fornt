import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPhoneComponent } from './send-phone.component';

describe('SendPhoneComponent', () => {
  let component: SendPhoneComponent;
  let fixture: ComponentFixture<SendPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendPhoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
