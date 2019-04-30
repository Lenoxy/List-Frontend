import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public listNames: string[];

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.getLists();
    
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
    const answer: Promise<any> = this.httpClient.post<object>(
      'http://localhost:3000/api/lists/get',
      {
        token: this.getCookie()
      }
    ).toPromise();
    answer.then((answeredListNames: string[]) => {
      this.listNames = answeredListNames;
    });
  }
}
