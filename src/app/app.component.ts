import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {

  public isHamburgerMenuOpen = false;
  public isOnInit = true;
  public isLoggedIn = false;
  @Input() input: boolean;

  ngOnChanges(input) {
    this.loginCheck();
  }

  constructor(private cookieService: CookieService, private router: Router) {
  }

  ngOnInit() {
    this.loginCheck();
    if (this.cookieService.check('token')) {
      this.router.navigate(['/list']);
    }
  }

  loginCheck(): void {
    this.cookieService.check('token') ? this.isLoggedIn = true : this.isLoggedIn;
  }


  onHamburgerPress() {
    this.isOnInit = false;
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }

  logout() {
    this.cookieService.delete('token');
    this.router.navigate(['/']);
    this.loginCheck();
  }


}
