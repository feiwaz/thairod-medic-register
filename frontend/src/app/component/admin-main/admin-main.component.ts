import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { ImageCachingService } from '../../service/image-caching.service';
import { WorkspaceService } from '../../service/workspace.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit, OnDestroy {

  readonly defaultMainUrl = '/admin/main/manage-account';
  mobileQuery: MediaQueryList;
  mainLogo = ''
  fillerNav = [{
    relativePath: './manage-account',
    label: 'การจัดการบัญชี'
  }, {
    relativePath: './manage-registered-user',
    label: 'ตรวจสอบรายชื่อผู้ลงทะเบียน'
  }, {
    relativePath: './manage-training-status',
    label: 'ตรวจสอบสถานะการอบรม'
  }];
  private mobileQueryListener: () => void;

  constructor(
    private authService: AuthenticationService,
    private imgCachingService: ImageCachingService,
    private router: Router,
    private workspaceService: WorkspaceService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.authService.getRefreshToken();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.mainLogo = this.imgCachingService.getImgElement('thairod-logo', { width: '80px', height: '68px' });
    const lastVisitedUrl = this.workspaceService.getLastVisitedUrl() || this.defaultMainUrl;
    this.router.navigate([lastVisitedUrl]);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  onRefreshClicked(): void {
    this.router.navigate(['/admin/main']);
  }

}
