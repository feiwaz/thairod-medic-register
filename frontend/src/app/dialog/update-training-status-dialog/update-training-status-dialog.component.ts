import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VolunteerService } from 'src/app/service/volunteer.service';

interface DepartmentCheckbox {
  formControlName: string;
  viewValue: string;
  value: boolean,
  volunteerId: number,
  departmentId: number
}

@Component({
  selector: 'app-update-training-status-dialog',
  templateUrl: './update-training-status-dialog.component.html',
  styleUrls: ['./update-training-status-dialog.component.scss']
})
export class UpdateTrainingStatusDialogComponent implements OnInit {

  isLoading = false;
  departments: DepartmentCheckbox[] = [];
  jobInfoForm = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private volunteerService: VolunteerService,
    public dialogRef: MatDialogRef<UpdateTrainingStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: { id: string, fullName: string, volunteerDepartments: [] } },
  ) {
    this.departments = this.data.row.volunteerDepartments.map((volDep: any) => ({
      formControlName: `department${volDep.department.id}`,
      viewValue: volDep.department.label,
      value: Boolean(volDep.trainingStatus),
      volunteerId: volDep.volunteerId,
      departmentId: volDep.departmentId
    }));
  }

  ngOnInit(): void {
    this.departments.forEach((department: DepartmentCheckbox) =>
      this.jobInfoForm.addControl(department.formControlName, this.fb.control(department.value)));
  }

  onSubmit(): void {
    this.isLoading = true;
    this.jobInfoForm.disable();
    this.updateTrainingStatus();
  }

  private updateTrainingStatus(): void {
    this.volunteerService.updateTrainingStatus(this.data.row.id, this.buildRequestBody()).subscribe(
      response => this.handleSuccessfulUpdate(),
      errorResponse => this.handleErrorUpdate(errorResponse)
    );
  }

  private buildRequestBody(): any[] {
    return this.departments.map((department: DepartmentCheckbox) => ({
      volunteerId: department.volunteerId,
      departmentId: department.departmentId,
      trainingStatus: Number(this.jobInfoForm.controls[department.formControlName].value)
    }));
  }

  private handleSuccessfulUpdate() {
    this.isLoading = false;
    this.dialogRef.close({ success: true });
  }

  private handleErrorUpdate(errorResponse: any): void {
    this.isLoading = false;
    this.jobInfoForm.enable();
    this.toastrService.warning('ทำรายการไม่สำเร็จ โปรดลองใหม่อีกครั้ง');
  }

}