import { Component } from '@angular/core';
import liff from '@line/liff';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  ngOnInit(): void {
    liff.init({ liffId: '1656379037-5YZdvN79' });
    if (!liff.isLoggedIn()) {
      console.log(liff.login());
    } else {
      liff.getProfile().then(profile =>
        sessionStorage.setItem('lineUserId', profile.userId));
    }
  }

}
