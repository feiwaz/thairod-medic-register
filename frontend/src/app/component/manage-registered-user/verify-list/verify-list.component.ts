import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BasicInfo } from 'src/app/model/basic-info';

@Component({
  selector: 'app-verify-list',
  templateUrl: './verify-list.component.html',
  styleUrls: ['./verify-list.component.scss']
})
export class VerifyListComponent implements OnInit {

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

  ngOnInit(): void {
  }

}
