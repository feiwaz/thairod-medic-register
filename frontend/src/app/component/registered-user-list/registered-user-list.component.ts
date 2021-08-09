import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { VerifyDetailDialogComponent } from 'src/app/dialog/verify-detail-dialog/verify-detail-dialog.component';
import { BasicInfo } from 'src/app/model/basic-info';
import { DoctorService } from 'src/app/service/doctor.service';
import { VolunteerService } from 'src/app/service/volunteer.service';

@Component({
  selector: 'app-registered-user-list',
  templateUrl: './registered-user-list.component.html',
  styleUrls: ['./registered-user-list.component.scss']
})
export class RegisteredUserListComponent implements OnInit {

  displayedColumns = ['createdTime', 'firstName', 'status', 'action'];
  selectedFilterColumn = 'createdTime';

  readonly pageSizeOptions = [6, 16, 30];
  readonly INFO_COLUMN_MAP: any = {
    createdTime: 'วันเวลาที่ลงทะเบียน',
    firstName: 'ชื่อ-นามสกุล',
    status: 'สถานะ'
  };

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
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.role === 'doctor') {
      this.getDoctor();
    } else {
      this.getVolunteer();
    }
  }

  getDoctor(): void {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe(
      entities => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(entities as BasicInfo[]);
        this.proceedSuccessResponse();
      },
      errorResponse => this.isLoading = false
    );
  }

  getVolunteer(): void {
    this.isLoading = true;
    this.volunteerService.getVolunteers().subscribe(
      entities => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(entities as BasicInfo[]);
        this.proceedSuccessResponse();
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
      .map(optionValue => {
        return {
          value: optionValue,
          viewValue: this.INFO_COLUMN_MAP[optionValue]
        };
      });
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
        if (result) {
          if (result.success === true && result.role) {
            result.role === 'doctor' ? this.getDoctor() : this.getVolunteer();
            this.toastrService.success('ตรวจสอบข้อมูลสำเร็จ');
          }
          else {
            const toastMessage = 'ทำรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
            this.toastrService.warning(toastMessage);
          }
        }
      }
    );
  }

  openUpdateDialog(dialogComponent: any, row: any): MatDialogRef<VerifyDetailDialogComponent> {
    return this.dialog.open(dialogComponent, {
      data: { row, role: this.role },
      autoFocus: false,
      height: '650px',
      width: '550px'
    });
  }

  formattedDate(dateString: string): string {
    moment.locale('th');
    return moment(dateString).format('DD MMM YYYY');
  }

}

