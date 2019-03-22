import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../answer';
import {Observable} from 'rxjs';
import {Validation} from '../validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public emailValue: string;
  public passwordValue = '';

  constructor(private httpClient: HttpClient) {
  }

  public login(): void {
    console.log('[HTTP] Input Values: \"' + this.emailValue + '\" , \"' + this.passwordValue + '\"');
    const val = new Validation();

    const guiValidation: Boolean[] = [val.validateEmail(this.emailValue), val.validatePassword(this.passwordValue)];

    if (guiValidation[0] === true && guiValidation[1] === true) {

      console.log('[HTTP] Sending to backend...');
      const answer: Observable<Answer> = this.httpClient.post<Answer>('http://localhost:3000/api/login', {
        email: this.emailValue,
        password: this.passwordValue
      });

      answer.subscribe((answer) => {
        console.log('[HTTP] Answer recieved: ' + answer);
        console.log('Token:', answer.token, 'Validation:', answer.validation, 'isPasswordCorrect:', answer.isPasswordCorrect, 'InternalError:', answer.internalError);
      });

      /*
      } else if (validation[0] === true && validation[1] === false) {
        console.log('[GUIValidation] Password is not valid');

      } else if (validation[0] === false && validation[1] === true) {
        console.log('[GUIValidation] Email is not valid');

      } else if (validation[0] === false && validation[1] === false) {
        console.log('[GUIValidation] Email and Password are not valid');
      */
    }
    console.log('[GUIValidation]', guiValidation[0], guiValidation[1]);
  }
}
