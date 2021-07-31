import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteDialogComponent } from 'src/app/dialog/delete-dialog/delete-dialog.component';
import { UserDialogComponent } from 'src/app/dialog/user-dialog/user-dialog.component';
import { User } from 'src/app/model/user.model';
import { AuthenticationService } from 'src/app/service/authentication.service';
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
    private authService: AuthenticationService,
    private router: Router,
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

  onCreateOrEditClicked(row?: User): void {
    this.openUpdateDialog(UserDialogComponent, row).afterClosed().subscribe(
      result => {
        if (result && result.success === true) {
          this.checkIfSelfUpdate(result);
          this.getUsers(result.isCreatingNew);
          let toastMessage = `ผู้ใช้ที่มีอีเมล ${result.entityId} ถูกสร้างเรียบร้อยแล้ว`;
          if (!result.isCreatingNew) {
            toastMessage = `ผู้ใช้ที่มี ID: ${result.entityId} ถูกแก้ไขเรียบร้อยแล้ว`;
          }
          this.toastrService.success(toastMessage);
        }
      }
    );
  }

  private checkIfSelfUpdate(result: any): void {
    const currentUser = this.authService.currentUser;
    if (!result.isCreatingNew && currentUser._id === result.user._id) {
      this.authService.updateCurrentUser(result.user);
      const newRole = result.user.role?.text || '';
      if (newRole.toLowerCase() !== 'admin') {
        this.router.navigate(['/admin']);
      }
    }
  }

  openUpdateDialog(dialogComponent: any, row: any): MatDialogRef<UserDialogComponent> {
    return this.dialog.open(dialogComponent, {
      data: { row },
      autoFocus: true,
      disableClose: true,
      width: '100%',
      panelClass: 'login-dialog-responsive',
    });
  }

  onDeleteClientClicked(row: User): void {
    this.openDeleteDialog({
      title: 'ลบผู้ใช้',
      content: `คุณต้องการลบผู้ใช้ที่มีอีเมล <em><u>${row.email}</u></em> หรือไม่?`,
      dataType: 'user-account',
      row
    }).afterClosed().subscribe(
      result => {
        if (result && result.success === true) {
          this.getUsers();
          this.toastrService.success(`ผู้ใช้ที่มีอีเมล ${result.entityId} ถูกลบเรียบร้อยแล้ว`);
        }
      }
    );
  }

  openDeleteDialog(data: any): MatDialogRef<DeleteDialogComponent> {
    return this.dialog.open(DeleteDialogComponent, {
      data,
      autoFocus: false,
      disableClose: true,
      width: '100%',
      panelClass: 'login-dialog-responsive',
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
