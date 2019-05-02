import {CookieService} from 'ngx-cookie-service';

export class cookie {

  constructor(private cookieService: CookieService) {
  }

  getCookie(): string {
    if (this.cookieService.check('token')) {
      return this.cookieService.get('token');
    } else {
      return null;
    }
  }

  setCookie(token: string) {
    if (token.length === 22) {
      this.cookieService.set('token', token);
    }
  }
}
