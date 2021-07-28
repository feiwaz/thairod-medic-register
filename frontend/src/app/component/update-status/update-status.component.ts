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
  id = '';
  status = 'pending';

  constructor(
    private imgCachingService: ImageCachingService,
    private router: Router
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.id = currentNavigation.extras.state?.id || this.id;
      this.status = currentNavigation.extras.state?.status || this.status;
    }
  }

  ngOnInit(): void {
    this.mainLogo = this.imgCachingService.getLogoImgElement();
  }

  onBackToMain(): void {
    this.router.navigate(['main']);
  }

}
