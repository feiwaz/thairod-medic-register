import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCachingService } from 'src/app/service/image-caching.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  mainLogo = '';
  verifyStatusLogo = '';
  nationalId = '';
  status = '';

  constructor(
    private imgCachingService: ImageCachingService,
    private router: Router
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.nationalId = currentNavigation.extras.state?.nationalId || this.nationalId;
      this.status = currentNavigation.extras.state?.status || this.status;
    }
  }

  ngOnInit(): void {
    this.mainLogo = this.imgCachingService.getImgElement('thairod-logo');
    this.verifyStatusLogo = this.imgCachingService.getImgElement('verify-status', { width: '320px', height: '320px' });
  }

  onBackToMain(): void {
    this.router.navigate(['main']);
  }

}
