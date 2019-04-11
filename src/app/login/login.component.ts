import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../class/answer';
import {Validation} from '../class/validation';
import {Router} from '@angular/router';
import {InstantValidation} from '../class/instantValidation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  emailValue = '';
  passwordValue = '';

  validationError: { [key: string]: string } = {};

  constructor(private httpClient: HttpClient, private router: Router) {
  }


  public onModelChangeValidator(type: string, $event) {
    const val = new InstantValidation();
    let valid;

    if (type === 'email') {
      this.emailValue = $event;
      valid = val.validateEmail($event);
      if (valid === true) {
        this.validationError.email = '';
      }
    } else if (type === 'password') {
      this.passwordValue = $event;
      valid = val.validatePassword($event);
      if (valid === true) {
        this.validationError.password = '';
      }
    }
    console.log('[ModelVal] Result for', type, 'is', valid);
  }


  public onBlurValidator(type: string) {
    let valid: boolean;
    const val = new Validation();
    if (type === 'email') {
      valid = val.validateEmail(this.emailValue);
      if (valid === true) {
        this.validationError.email = '';
      } else {
        this.validationError.email = this.displayEmailValidation(valid);
      }
    } else if (type === 'password') {
      valid = val.validatePassword(this.passwordValue);
      if (valid === true) {
        this.validationError.password = '';
      } else {
        this.validationError.password = this.displayPasswordValidation(valid);
      }
    }

    console.log('[BlurVal] Validated', type, 'as', valid);
  }


  public displayEmailValidation(validationResult: boolean, answer?: Answer) {

    if (answer != null) {
      if (answer.code === 102) {
        return 'This email has not been registered yet';
      }
    }

    if (!validationResult) {
      return 'Please enter a valid email';
    } else {
      return '';
    }
  }

  public displayPasswordValidation(validationResult: boolean, answer?: Answer) {

    if (answer != null) {
      if (answer.code === 101) {
        return 'Given password does not match given Email';
      }
    }

    if (!validationResult) {
      return 'Please enter a valid password';
    } else {
      return '';
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


    this.validationError.email = this.displayEmailValidation(guiValidation.email);
    this.validationError.password = this.displayPasswordValidation(guiValidation.password);

    if (!this.validationError.email && !this.validationError.password) {

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
          this.validationError.email = this.displayEmailValidation(answer.validation.email, answer);
          this.validationError.password = this.displayPasswordValidation(answer.validation.password, answer);
        }

      });
    }
  }
}
