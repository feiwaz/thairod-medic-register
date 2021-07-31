import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {

  displayedColumns = ['email', 'name', '_id', 'role', 'action'];
  selectedFilterColumn = 'email';

  readonly pageSizeOptions = [6, 16, 30];
  readonly USER_COLUMN_MAP: any = {
    email: 'อีเมล',
    name: 'ชื่อ-นามสกุล',
    _id: 'ID',
    role: 'บทบาทในเว็ป'
  };

  isLoading = true;
  selectColumnOptions: any = [];
  excludedSelectColumnOptions = ['action'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(
    private service: UserService,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(isCreatingNew = false): void {
    this.isLoading = true;
    this.service.getUsers().subscribe(
      users => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(users as User[]);
        this.proceedSuccessResponse(isCreatingNew, '_id');
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

  onCreateOrEditClicked(): void { }

  onDeleteClientClicked(): void { }

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
