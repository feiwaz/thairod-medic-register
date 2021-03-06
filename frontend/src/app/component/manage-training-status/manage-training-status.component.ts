import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UpdateTrainingStatusDialogComponent } from '../../dialog/update-training-status-dialog/update-training-status-dialog.component';
import { BasicInfo } from '../../model/basic-info.model';
import { VolunteerService } from '../../service/volunteer.service';
import { WorkspaceService } from '../../service/workspace.service';

@Component({
  selector: 'app-manage-training-status',
  templateUrl: './manage-training-status.component.html',
  styleUrls: ['./manage-training-status.component.scss']
})
export class ManageTrainingStatusComponent implements OnInit {

  displayedColumns = ['firstName', 'trainingStatusPassed', 'trainingStatusFailed', 'action'];
  selectedFilterColumn = 'firstName';

  readonly pageSizeOptions = [5, 10, 30, 50, 100];
  defaultPaginator = { pageSize: 10 };
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
    this.updateWorkspace();
    this.getApprovedVolunteers();
  }

  private updateWorkspace() {
    const workspace = this.workspaceService.getWorkspace();
    if (workspace && workspace.manageTrainingStatus != null) {
      const { pageSize } = workspace.manageTrainingStatus.paginator;
      this.defaultPaginator.pageSize = pageSize;
    }
    this.workspaceService.save({
      manageTrainingStatus: { paginator: this.defaultPaginator }
    });
  }

  private getApprovedVolunteers(): void {
    this.isLoading = true;
    this.service.getApprovedVolunteers().subscribe(
      users => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(users as BasicInfo[]);
        this.proceedSuccessResponse();
      },
      errorResponse => this.isLoading = false
    );
  }

  proceedSuccessResponse(): void {
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.initSelectColumnOptions();
    this.setUpFilterPredicate();
  }

  initSelectColumnOptions(): void {
    this.selectColumnOptions = Array.from(this.displayedColumns)
      .filter(column => !this.excludedSelectColumnOptions.includes(column))
      .map(optionValue => ({
        value: optionValue,
        viewValue: this.USER_COLUMN_MAP[optionValue]
      }));
  }

  setUpFilterPredicate(): void {
    this.dataSource.filterPredicate = (row: any, filter: string) => {
      const rowValue = row[this.selectedFilterColumn];
      if (rowValue) {
        if (this.selectedFilterColumn === 'role') {
          return this.ROLE_MAP[rowValue].includes(filter);
        } else {
          if (this.selectedFilterColumn === 'firstName') {
            const fullName = `${row.initial} ${rowValue} ${row.lastName}`;
            return fullName.toString().toLowerCase().includes(filter);
          } else {
            return rowValue.toString().toLowerCase().includes(filter);
          }
        }
      } else {
        let traingStatus = -1;
        if (this.selectedFilterColumn === 'trainingStatusPassed') {
          traingStatus = 1;
        } else if (this.selectedFilterColumn === 'trainingStatusFailed') {
          traingStatus = 0;
        }
        if (traingStatus !== -1) {
          if (row.volunteerDepartments) {
            const departments = row.volunteerDepartments
              .filter((volDep: any) => volDep.trainingStatus === traingStatus)
              .map((volDep: any) => volDep.department.label.toLowerCase());
            return departments.find((department: string) => department.includes(filter));
          }
        }
        return false;
      }
    };
  }

  onEditClicked(row: any): void {
    const dataRow = {
      id: row.id,
      fullName: `${row.firstName} ${row.lastName}`,
      volunteerDepartments: row.volunteerDepartments
    };
    this.openUpdateDialog(UpdateTrainingStatusDialogComponent, dataRow).afterClosed().subscribe(
      result => {
        if (result && result.success === true) {
          this.getApprovedVolunteers();
          this.toastrService.success('บันทึกสำเร็จ');
        }
      }
    );
  }

  openUpdateDialog(dialogComponent: any, row: any): MatDialogRef<UpdateTrainingStatusDialogComponent> {
    return this.dialog.open(dialogComponent, {
      data: { row },
      autoFocus: false,
      disableClose: true,
      width: '100%',
      panelClass: 'dialog-responsive'
    });
  }

  onSelectColumnChanged(columnChange: { column: string, searchText: string }): void {
    this.selectedFilterColumn = columnChange.column;
    this.dataSource.filter = columnChange.searchText.trim().toLowerCase();
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

  onPaginatorChanged(event: PageEvent) {
    const paginator = { pageSize: event.pageSize };
    this.workspaceService.save({
      manageTrainingStatus: { paginator }
    });
  }

}
