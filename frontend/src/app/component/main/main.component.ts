import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCachingService } from 'src/app/service/image-caching.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  mainLogo = ''

  constructor(
    private imgCachingService: ImageCachingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mainLogo = this.imgCachingService.getLogoImgElement();
  }

  onRegister(role = 'volunteer'): void {
    this.router.navigate([`/${role}/verify-id`]);
  }

  onCheckStatus(): void {
    this.router.navigate(['verify-id']);
  }

}
