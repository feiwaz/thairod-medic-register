import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusDictionary } from 'src/app/constant/status-dictionary';
import { ImageCachingService } from 'src/app/service/image-caching.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  mainLogo = '';
  verifyStatusLogo = '';
  id = '';
  status = StatusDictionary['pending'];

  constructor(
    private imgCachingService: ImageCachingService,
    private router: Router
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.id = currentNavigation.extras.state?.id || this.id;
      const stateStatus: 'pending' | 'approved' = currentNavigation.extras.state?.status || 'pending';
      this.status = StatusDictionary[stateStatus];
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
