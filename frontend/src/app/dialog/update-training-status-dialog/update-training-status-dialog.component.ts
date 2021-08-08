import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DEPARTMENTS } from 'src/app/constant/departments';

@Component({
  selector: 'app-update-training-status-dialog',
  templateUrl: './update-training-status-dialog.component.html',
  styleUrls: ['./update-training-status-dialog.component.scss']
})
export class UpdateTrainingStatusDialogComponent implements OnInit {

  isLoading = false;
  departments = DEPARTMENTS;

  jobInfoForm = this.fb.group({
    department1: false,
    department2: false,
    department3: false,
    department4: false,
    department5: false,
    department6: false,
    department7: false,
    department8: false,
    department9: false,
    department10: false,
    department11: false
  });

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void { }

  private handleErrorUpdate(errorResponse: any): void {
    this.isLoading = false;
    this.jobInfoForm.enable();
    this.toastrService.warning('ทำรายการไม่สำเร็จ โปรดลองใหม่อีกครั้ง');
  }

}
