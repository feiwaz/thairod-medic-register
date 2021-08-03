import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerJobInfoFormComponent } from './volunteer-job-info-form.component';

describe('VolunteerJobInfoFormComponent', () => {
  let component: VolunteerJobInfoFormComponent;
  let fixture: ComponentFixture<VolunteerJobInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunteerJobInfoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerJobInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
