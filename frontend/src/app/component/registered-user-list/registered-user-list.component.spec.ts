import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredUserListComponent } from './registered-user-list.component';

describe('RegisteredUserListComponent', () => {
  let component: RegisteredUserListComponent;
  let fixture: ComponentFixture<RegisteredUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisteredUserListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
