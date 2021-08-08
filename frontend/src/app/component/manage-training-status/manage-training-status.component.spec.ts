import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTrainingStatusComponent } from './manage-training-status.component';

describe('ManageTrainingStatusComponent', () => {
  let component: ManageTrainingStatusComponent;
  let fixture: ComponentFixture<ManageTrainingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTrainingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTrainingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
