import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCachingService } from '../../service/image-caching.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  mainLogo = ''
  doctorImg = ''
  volImg = ''
  checkStatusLogo = ''

  constructor(
    private imgCachingService: ImageCachingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mainLogo = this.imgCachingService.getImgElement('thairod-logo');
    this.doctorImg = this.imgCachingService.getImgElement('register-doctor');
    this.volImg = this.imgCachingService.getImgElement('register-volunteer');
    this.checkStatusLogo = this.imgCachingService.getImgElement('check-status');
  }

  onRegister(role = 'volunteer'): void {
    this.router.navigate([`/${role}/verify-id`]);
  }

  onCheckStatus(): void {
    this.router.navigate(['verify-id']);
  }

}
