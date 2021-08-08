import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UpdateTrainingStatusDialogComponent } from 'src/app/dialog/update-training-status-dialog/update-training-status-dialog.component';
import { BasicInfo } from 'src/app/model/basic-info';
import { VolunteerService } from 'src/app/service/volunteer.service';
import { WorkspaceService } from 'src/app/service/workspace.service';

@Component({
  selector: 'app-manage-training-status',
  templateUrl: './manage-training-status.component.html',
  styleUrls: ['./manage-training-status.component.scss']
})
export class ManageTrainingStatusComponent implements OnInit {

  displayedColumns = ['firstName', 'trainingStatusPassed', 'trainingStatusFailed', 'action'];
  selectedFilterColumn = 'firstName';

  readonly pageSizeOptions = [6, 16, 30];
  readonly USER_COLUMN_MAP: any = {
    firstName: 'ชื่อ-นามสกุล',
    trainingStatusPassed: 'รายการฝึกอบรมที่ผ่าน',
    trainingStatusFailed: 'รายการฝึกอบรมที่ยังไม่ผ่าน'
  };
  readonly ROLE_MAP: any = {
    user: 'ผู้ตรวจสอบ',
    admin: 'แอดมิน'
  };

  isLoading = true;
  selectColumnOptions: any = [];
  excludedSelectColumnOptions = ['action'];
  dataSource = new MatTableDataSource<BasicInfo>();

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(
    private service: VolunteerService,
    private toastrService: ToastrService,
    private workspaceService: WorkspaceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.workspaceService.save();
    this.getUsers();
  }

  private getUsers(isCreatingNew = false): void {
    this.isLoading = true;
    this.service.getVolunteers().subscribe(
      users => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(users as BasicInfo[]);
        this.proceedSuccessResponse(isCreatingNew, 'firstName');
      },
      errorResponse => this.isLoading = false
    );
  }

  proceedSuccessResponse(isCreatingNew = true, columnId: string): void {
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    if (isCreatingNew) {
      if (this.sort.direction !== 'desc' && columnId) {
        this.sort.sort({ disableClear: true, id: columnId, start: 'desc' });
      }
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.initSelectColumnOptions();
    this.setUpFilterPredicate();
  }

  initSelectColumnOptions(): void {
    this.selectColumnOptions = Array.from(this.displayedColumns)
      .filter(column => !this.excludedSelectColumnOptions.includes(column))
      .map(optionValue => {
        return {
          value: optionValue,
          viewValue: this.USER_COLUMN_MAP[optionValue]
        };
      });
  }

  setUpFilterPredicate(): void {
    this.dataSource.filterPredicate = (row: any, filter: string) => {
      const rowValue = row[this.selectedFilterColumn];
      if (rowValue) {
        if (this.selectedFilterColumn === 'role') {
          return this.ROLE_MAP[rowValue].includes(filter);
        } else {
          if (this.selectedFilterColumn === 'firstName') {
            const fullName = `${rowValue} ${row.lastName}`;
            return fullName.toString().toLowerCase().includes(filter);
          } else {
            return rowValue.toString().toLowerCase().includes(filter);
          }
        }
      } else {
        return false;
      }
    };
  }

  onClick(row?: any): void {
    this.openUpdateDialog(UpdateTrainingStatusDialogComponent, row).afterClosed().subscribe(
      result => {
        if (result && result.success === true) {
          this.toastrService.success('บันทึกสำเร็จ');
        }
      }
    );
  }

  openUpdateDialog(dialogComponent: any, row: any): MatDialogRef<UpdateTrainingStatusDialogComponent> {
    return this.dialog.open(dialogComponent, {
      data: { row },
      autoFocus: false,
      height: '650px',
      width: '550px'
    });
  }

  onSelectColumnChanged(column: string): void {
    this.selectedFilterColumn = column;
  }

  onFilterTextChanged(filterText: string): void {
    this.dataSource.filter = filterText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFilterTextCleared(filterText: string): void {
    this.dataSource.filter = filterText;
  }

}
