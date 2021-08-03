import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BasicInfo } from 'src/app/model/basic-info';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-verify-list',
  templateUrl: './verify-list.component.html',
  styleUrls: ['./verify-list.component.scss']
})
export class VerifyListComponent implements OnInit {

  displayedColumns = ['dateTime', 'name', 'email', 'status'];
  selectedFilterColumn = 'dateTime';

  readonly pageSizeOptions = [6, 16, 30];
  readonly USER_COLUMN_MAP: any = {
    dateTime: 'วันเวลาที่ลงทะเบียน',
    name: 'ชื่อ-นามสกุล',
    email: 'อีเมล์',
    status: 'สถานะ'
  };
  
  isLoading = false;
  selectColumnOptions: any = [];
  dataSource = new MatTableDataSource<BasicInfo>();
  constructor() { }

  ngOnInit(): void {
  }

}
