import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VerifyDetailDialogComponent } from 'src/app/dialog/verify-detail-dialog/verify-detail-dialog.component';
import { BasicInfo } from 'src/app/model/basic-info';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { VolunteerService } from 'src/app/service/volunteer.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

  displayedColumns = ['dateTime', 'name', 'status', 'action'];
  selectedFilterColumn = 'dateTime';

  readonly pageSizeOptions = [6, 16, 30];
  readonly INFO_COLUMN_MAP: any = {
    dateTime: 'วันเวลาที่ลงทะเบียน',
    name: 'ชื่อ-นามสกุล',
    status: 'สถานะ'
  };
  
  isLoading = false;
  selectColumnOptions: any = [];
  excludedSelectColumnOptions = ['action'];
  dataSource = new MatTableDataSource<BasicInfo>()
  
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;;

  @Input() type:'doctor'|'volunteer' = 'doctor'

  constructor(
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private router: Router,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getVolunteer();
    if (this.type === 'doctor'){
      this.getDoctor();
    } else {
      this.getVolunteer();
    }
  }

  getDoctor(): void {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe(
      doctor => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(doctor as BasicInfo[]);
        this.proceedSuccessResponse();
      },
      errorResponse => this.isLoading = false
    );
  }

  getVolunteer(): void {
    this.isLoading = true;
    this.volunteerService.getVolunteers().subscribe(
      doctor => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(doctor as BasicInfo[]);
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
        if (Array.isArray(rowValue)) {
          return rowValue.map(value => value.toLowerCase()).includes(filter);
        } else {
          return rowValue.toString().toLowerCase().includes(filter);
        }
      } else {
        return false;
      }
    };
  }

  onClick(row?:any):void {
      this.openUpdateDialog(VerifyDetailDialogComponent, row).afterClosed().subscribe(
        result => {
          if (result && result.success === true) {
            let toastMessage = `ผู้ใช้ที่มีอีเมล ${result.entityId} ถูกสร้างเรียบร้อยแล้ว`;
            if (!result.isCreatingNew) {
              toastMessage = `ผู้ใช้ที่มี ID: ${result.entityId} ถูกแก้ไขเรียบร้อยแล้ว`;
            }
            this.toastrService.success(toastMessage);
          }
        }
      );
  }

  openUpdateDialog(dialogComponent: any, row: any): MatDialogRef<VerifyDetailDialogComponent> {
    return this.dialog.open(dialogComponent, {
      data: { row },
      autoFocus: true,
      disableClose: true,
      height: '650px',
      width: '550px'
    });
  }
}

