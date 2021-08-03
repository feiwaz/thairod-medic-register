import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyProcessComponent } from './verify-process.component';

describe('VerifyProcessComponent', () => {
  let component: VerifyProcessComponent;
  let fixture: ComponentFixture<VerifyProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
