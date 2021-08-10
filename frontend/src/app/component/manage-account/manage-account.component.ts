import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteDialogComponent } from 'src/app/dialog/delete-dialog/delete-dialog.component';
import { UserDialogComponent } from 'src/app/dialog/user-dialog/user-dialog.component';
import { User } from 'src/app/model/user.model';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { WorkspaceService } from 'src/app/service/workspace.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {

  displayedColumns = ['id', 'firstName', 'role', 'contactNumber', 'email', 'isActive', 'action'];
  selectedFilterColumn = 'firstName';

  readonly pageSizeOptions = [5, 10, 30, 50, 100];
  defaultPaginator = { pageSize: 10 };
  readonly USER_COLUMN_MAP: any = {
    id: 'ID',
    firstName: 'ชื่อ-นามสกุล',
    role: 'บทบาทในเว็ป',
    contactNumber: 'เบอร์โทรศัพท์',
    email: 'อีเมล',
    isActive: 'สถานะ'
  };
  readonly ROLE_MAP: any = {
    user: 'ผู้ตรวจสอบ',
    admin: 'แอดมิน'
  };

  isLoading = true;
  selectColumnOptions: any = [];
  excludedSelectColumnOptions = ['isActive', 'action'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(
    private service: UserService,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private router: Router,
    private workspaceService: WorkspaceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.updateWorkspace();
    this.getUsers();
  }

  private updateWorkspace() {
    const workspace = this.workspaceService.getWorkspace();
    if (workspace && workspace.manageAccount != null) {
      const { pageSize } = workspace.manageAccount.paginator;
      this.defaultPaginator.pageSize = pageSize;
    }
    this.workspaceService.save({
      manageAccount: { paginator: this.defaultPaginator }
    });
  }

  private getUsers(isCreatingNew = false): void {
    this.isLoading = true;
    this.service.getUsers().subscribe(
      users => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(users as User[]);
        this.proceedSuccessResponse(isCreatingNew, 'id');
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
    if (!result.isCreatingNew && currentUser.id === result.user.id) {
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
      panelClass: 'dialog-responsive'
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
      panelClass: 'dialog-responsive'
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

  onIsActiveChange(row: any, checked: boolean): void {
    this.isLoading = true;
    row.isActive = checked;
    this.service.patchUser(row.id, { isActive: checked } as User).subscribe(
      response => this.isLoading = false,
      errorResponse => {
        this.isLoading = false;
        row.isActive = !checked;
        this.toastrService.warning('แก้ไขไม่สำเร็จ');
      }
    );
  }

  onPaginatorChanged(event: PageEvent) {
    const paginator = { pageSize: event.pageSize };
    this.workspaceService.save({
      manageAccount: { paginator }
    });
  }

}
