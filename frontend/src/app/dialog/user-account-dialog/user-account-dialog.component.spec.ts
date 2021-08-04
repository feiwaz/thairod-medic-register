import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountDialogComponent } from './user-account-dialog.component';

describe('UserAccountDialogComponent', () => {
  let component: UserAccountDialogComponent;
  let fixture: ComponentFixture<UserAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
