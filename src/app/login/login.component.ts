import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../class/answer';
import {Validation} from '../class/validation';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public emailValue: string;
  public passwordValue = '';
  public emailGuiReturn: string = '';
  public passwordGuiReturn: string = '';

  //TODO

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  public displayEmailValidation(validationResult: Boolean, answer?: Answer) {
    if (!validationResult) {
      this.emailGuiReturn = 'Please enter a valid email';
    } else {
      this.emailGuiReturn = '';
    }

    if (answer != null) {
      if (answer.code === 102) {
        this.emailGuiReturn = 'This email is not yet registered';
      }
    }
  }

  public displayPasswordValidation(validationResult: Boolean, answer?: Answer) {
    if (!validationResult) {
      this.passwordGuiReturn = 'The password is not valid';
    } else {
      this.passwordGuiReturn = '';
    }

    if (answer != null) {
      if (answer.code === 101) {
        this.emailGuiReturn = 'Given password does not match given Email';
      }
    }


  }


  public login(): void {
    console.log('[Login] Input Values: \"' + this.emailValue + '\" , \"' + this.passwordValue + '\"');
    const val = new Validation();

    const guiValidation = {
      email: val.validateEmail(this.emailValue),
      password: val.validatePassword(this.passwordValue)
    };
    console.log('[GUIValidation]', guiValidation.email, guiValidation.password);


    this.displayEmailValidation(guiValidation.email);
    this.displayPasswordValidation(guiValidation.password);


    if (guiValidation.email && guiValidation.password) {

      console.log('[HTTP] Sending to backend...');
      const answer: Promise<Answer> = this.httpClient.post<Answer>('http://localhost:3000/api/login', {
        email: this.emailValue,
        password: this.passwordValue
      }).toPromise();

      answer.then((answer) => {
        console.log('[HTTP] Answer recieved: Token:', answer.token, 'Validation:', answer.validation, 'successCode:', answer.code);

        if (answer.validation.email && answer.validation.password && answer.code == 1) {
          this.router.navigate(['/list']);
        } else {
          this.displayEmailValidation(answer.validation.email, answer);
          this.displayPasswordValidation(answer.validation.password, answer);
        }

      });
    }
  }
}
