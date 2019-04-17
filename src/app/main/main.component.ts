import {Component} from '@angular/core';
import {Answer} from '../class/answer';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }

  getCookie(): string {
    if (this.cookieService.check('token')) {
      return this.cookieService.get('token');
    } else {
      return null;
    }
  }

  public getLists() {
    console.log('[Cookie] Value:', this.getCookie());
    const answer: Promise<Answer> = this.httpClient.post<Answer>(
      'http://localhost:3000/api/lists/get',
      {
        cookie: this.getCookie()
      }
    ).toPromise();


  }

}
