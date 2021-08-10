import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { VerifyDetailDialogComponent } from 'src/app/dialog/verify-detail-dialog/verify-detail-dialog.component';
import { BasicInfo } from 'src/app/model/basic-info';
import { DoctorService } from 'src/app/service/doctor.service';
import { VolunteerService } from 'src/app/service/volunteer.service';
import { WorkspaceService } from 'src/app/service/workspace.service';

@Component({
  selector: 'app-registered-user-list',
  templateUrl: './registered-user-list.component.html',
  styleUrls: ['./registered-user-list.component.scss']
})
export class RegisteredUserListComponent implements OnInit {

  displayedColumns = ['createdTime', 'firstName', 'status', 'action'];
  selectedFilterColumn = 'createdTime';

  readonly pageSizeOptions = [5, 10, 30, 50, 100];
  defaultPaginator = { pageSize: 10 };
  readonly INFO_COLUMN_MAP: any = {
    createdTime: 'วันเวลาที่ลงทะเบียน',
    firstName: 'ชื่อ-นามสกุล',
    status: 'สถานะ'
  };

  getEntities$: Observable<any[]> = this.volunteerService.getVolunteers();
  isLoading = false;
  selectColumnOptions: any = [];
  excludedSelectColumnOptions = ['action'];
  dataSource = new MatTableDataSource<BasicInfo>()

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;;

  @Input() role: 'doctor' | 'volunteer' = 'doctor'

  constructor(
    private toastrService: ToastrService,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
    private workspaceService: WorkspaceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.updateWorkspace();
    this.getEntities$ = this.role === 'doctor'
      ? this.doctorService.getDoctors()
      : this.volunteerService.getVolunteers();
    this.getEntities();
  }

  private updateWorkspace() {
    const workspace = this.workspaceService.getWorkspace();
    if (workspace && workspace.manageRegisteredUser != null) {
      const key = this.role === 'doctor' ? 'doctorPaginator' : 'volunteerPaginator';
      const { pageSize } = workspace.manageRegisteredUser[key] || this.defaultPaginator;
      this.defaultPaginator.pageSize = pageSize;
    }
    let manageRegisteredUser = {} as any;
    if (this.role === 'doctor') {
      manageRegisteredUser['doctorPaginator'] = this.defaultPaginator;
    } else {
      manageRegisteredUser['volunteerPaginator'] = this.defaultPaginator;
    }
    this.workspaceService.save({ manageRegisteredUser });
  }

  getEntities(row?: any): void {
    this.isLoading = true;
    this.getEntities$.subscribe(
      entities => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(entities as BasicInfo[]);
        this.proceedSuccessResponse();
        if (row && row.status === 'รอการอนุมัติ') {
          this.onClick(row);
        }
      },
      errorResponse => this.isLoading = false
    );
  }

  proceedSuccessResponse(): void {
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item: any, property): string | number => {
      switch (property) {
        case 'createdTime': return new Date(item.createdTime).getTime();
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.initSelectColumnOptions();
    this.setUpFilterPredicate();
  }

  initSelectColumnOptions(): void {
    this.selectColumnOptions = Array.from(this.displayedColumns)
      .filter(column => !this.excludedSelectColumnOptions.includes(column))
      .map(optionValue => ({
        value: optionValue,
        viewValue: this.INFO_COLUMN_MAP[optionValue]
      }));
  }

  setUpFilterPredicate(): void {
    this.dataSource.filterPredicate = (row: any, filter: string) => {
      const rowValue = row[this.selectedFilterColumn];
      if (rowValue) {
        if (this.selectedFilterColumn === 'createdTime') {
          return this.formattedDate(rowValue).includes(filter)
        } else if (this.selectedFilterColumn === 'firstName') {
          const fullName = `${row.initial} ${rowValue} ${row.lastName}`;
          return fullName.toString().toLowerCase().includes(filter);
        } else {
          return rowValue.toString().toLowerCase().includes(filter);
        }
      } else {
        return false;
      }
    };
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

  onClick(row: any): void {
    this.openUpdateDialog(VerifyDetailDialogComponent, row).afterClosed().subscribe(
      result => {
        if (result && result.success === true && result.role) {
          // TODO: add note here too
          row.status = result.status;
          this.getEntities();
          this.toastrService.success('ตรวจสอบข้อมูลสำเร็จ');
        }
      }
    );
  }

  openUpdateDialog(dialogComponent: any, row: any): MatDialogRef<VerifyDetailDialogComponent> {
    return this.dialog.open(dialogComponent, {
      data: { row, role: this.role },
      autoFocus: false,
      disableClose: true,
      width: '100%',
      panelClass: 'dialog-responsive'
    });
  }

  formattedDate(dateString: string): string {
    return moment(dateString).locale('th').format('DD MMM YYYY');
  }

  onPaginatorChanged(event: PageEvent) {
    const paginator = { pageSize: event.pageSize };
    let manageRegisteredUser = {} as any;
    if (this.role === 'doctor') {
      manageRegisteredUser['doctorPaginator'] = paginator;
    } else {
      manageRegisteredUser['volunteerPaginator'] = paginator;
    }
    this.workspaceService.save({ manageRegisteredUser });
  }

}

