import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyListComponent } from './verify-list.component';

describe('VerifyListComponent', () => {
  let component: VerifyListComponent;
  let fixture: ComponentFixture<VerifyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
