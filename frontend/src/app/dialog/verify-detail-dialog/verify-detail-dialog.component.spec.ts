import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDetailDialogComponent } from './verify-detail-dialog.component';

describe('VerifyDetailDialogComponent', () => {
  let component: VerifyDetailDialogComponent;
  let fixture: ComponentFixture<VerifyDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
