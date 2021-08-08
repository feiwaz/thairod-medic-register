import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTrainingStatusDialogComponent } from './update-training-status-dialog.component';

describe('UpdateTrainingStatusDialogComponent', () => {
  let component: UpdateTrainingStatusDialogComponent;
  let fixture: ComponentFixture<UpdateTrainingStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTrainingStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTrainingStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
