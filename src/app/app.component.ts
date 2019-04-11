import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isHamburgerMenuOpen = false;

  onHamnurgerPress() {

    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
    if (this.isHamburgerMenuOpen) {
      console.log('[GUI] Menu shown');
    } else {
      console.log('[GUI] Menu hidden');
    }
  }

}
