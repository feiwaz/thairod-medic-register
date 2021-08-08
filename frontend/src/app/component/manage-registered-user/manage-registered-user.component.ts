import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BasicInfo } from 'src/app/model/basic-info';

@Component({
  selector: 'app-manage-registered-user',
  templateUrl: './manage-registered-user.component.html',
  styleUrls: ['./manage-registered-user.component.scss']
})
export class ManageRegisteredUserComponent implements OnInit {

  displayedColumns = ['dateTime', 'name', 'status', 'action'];
  selectedFilterColumn = 'dateTime';

  readonly pageSizeOptions = [6, 16, 30];
  readonly DOCTOR_COLUMN_MAP: any = {
    dateTime: 'วันเวลาที่ลงทะเบียน',
    name: 'ชื่อ-นามสกุล',
    status: 'สถานะ'
  };

  isLoading = false;
  selectColumnOptions: any = [];
  dataSource = new MatTableDataSource<BasicInfo>();
  constructor() { }

  ngOnInit(): void { }

}
