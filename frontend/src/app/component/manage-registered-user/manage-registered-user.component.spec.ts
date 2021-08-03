import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRegisteredUserComponent } from './manage-registered-user.component';

describe('ManageRegisteredUserComponent', () => {
  let component: ManageRegisteredUserComponent;
  let fixture: ComponentFixture<ManageRegisteredUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRegisteredUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRegisteredUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
