import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {AppStateService} from './services/app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //Mobile Menubar
  public isHamburgerMenuOpen = false;
  public isOnInit = true;

  constructor(private cookieService: CookieService, private router: Router, private appState: AppStateService) {
  }

  get isLoggedIn() {
    if (this.cookieService.check('token')) {

    }

    return this.appState.state.loggedInUserEmail !== null;
  }

  ngOnInit() {
    if (this.cookieService.check('token')) {
      this.appState.state.loggedInUserEmail = '-';
      //TODO: This is not a clean nor a final Solution
    }
  }

  onHamburgerPress() {
    this.isOnInit = false;
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }

  logout() {
    this.cookieService.delete('token');
    this.router.navigate(['/']);
    this.appState.state.loggedInUserEmail = null;
    this.isHamburgerMenuOpen = false;
  }
}


