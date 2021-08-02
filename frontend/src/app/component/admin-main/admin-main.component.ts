import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCachingService } from 'src/app/service/image-caching.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  mainLogo = ''
  fillerNav = [{
    relativePath: './manage-account',
    label: 'การจัดการบัญชี'
  }, {
    relativePath: './manage-user',
    label: 'รายชื่อผู้ลงทะเบียน'
  }, {
    relativePath: './manage-user-training-status',
    label: 'สถานะการอบรม'
  }];

  private mobileQueryListener: () => void;

  constructor(
    private imgCachingService: ImageCachingService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.mainLogo = this.imgCachingService.getImgElement('thairod-logo', { width: '80px', height: '68px' });
    this.router.navigate(['/admin/main/manage-account']);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

}
