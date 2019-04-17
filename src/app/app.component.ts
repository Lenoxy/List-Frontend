import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private cookieService: CookieService, private router: Router) {
  }

  ngOnInit() {
    if (this.cookieService.check('token')) {
      this.router.navigate(['/list']);
    }
  }


  isHamburgerMenuOpen = false;
  isOnInit = true;

  onHamburgerPress() {
    this.isOnInit = false;
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }


}
