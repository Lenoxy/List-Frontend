import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Answer} from '../answer';
import {Validation} from '../validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public emailValue: string;
  public usernameValue: string;
  public passwordValue: string;
  public repeatPasswordValue: string;

  constructor(private httpClient: HttpClient) {
  }


  public register(): void {
    console.log('[Register] Input Values: \"' + this.emailValue + '\" , \"' + this.usernameValue + '\" , \"' + this.passwordValue + '\" , \"' + this.repeatPasswordValue + '\"');
    const val = new Validation();

    const guiValidation: Boolean[] = [val.validateEmail(this.emailValue), val.validateUsername(this.usernameValue), val.validatePassword(this.passwordValue, this.repeatPasswordValue)];
    console.log('[GUIValidation]', guiValidation[0], guiValidation[1], guiValidation[2]);

    if (guiValidation[0] == true && guiValidation[1] == true && guiValidation[2] == true) {

      console.log('[HTTP] Sending to backend...');
      const answer: Observable<Answer> = this.httpClient.post<Answer>('http://localhost:3000/api/register', {
        email: this.emailValue,
        username: this.usernameValue,
        password: this.passwordValue,
        repeatPassword: this.repeatPasswordValue
      }).toPromise();
      answer.subscribe((answer) => {
        console.log('[HTTP] Answer recieved: Token:', answer.token, 'Validation:', answer.validation, 'successCode:', answer.code);
      });

    }


  }
}
