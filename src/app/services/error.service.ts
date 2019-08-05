import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) {
  }

  alert(name: string) {
    alert(name);
  }

  alertAndRedirect(name: string) {
    alert(name);
    this.router.navigate(['/']);

  }

}
