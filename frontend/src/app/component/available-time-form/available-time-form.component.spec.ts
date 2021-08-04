import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableTimeFormComponent } from './available-time-form.component';

describe('AvailableTimeFormComponent', () => {
  let component: AvailableTimeFormComponent;
  let fixture: ComponentFixture<AvailableTimeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableTimeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableTimeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
