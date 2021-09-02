import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import liff from '@line/liff';
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
    this.initializeLiffApp();
    this.mainLogo = this.imgCachingService.getImgElement('thairod-logo');
    this.doctorImg = this.imgCachingService.getImgElement('register-doctor');
    this.volImg = this.imgCachingService.getImgElement('register-volunteer');
    this.checkStatusLogo = this.imgCachingService.getImgElement('check-status');
  }

  private initializeLiffApp() {
    liff.init({ liffId: '1656379037-5YZdvN79' });
    liff.ready.then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });
  }

  onRegister(role = 'volunteer'): void {
    this.router.navigate([`/${role}/verify-id`]);
  }

  onCheckStatus(): void {
    this.router.navigate(['verify-id']);
  }

}
