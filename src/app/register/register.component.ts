import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../class/answer';
import {Validation} from '../class/validation';
import {Router} from '@angular/router';
import {InstantValidation} from '../class/instantValidation';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  emailValue: string;
  usernameValue: string;
  passwordValue: string;
  repeatPasswordValue: string;

  validationError: { [key: string]: string } = {};

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
  }


  public onModelChangeValidator(type: string, $event) {
    const val = new InstantValidation();
    let valid;

    if (type === 'username') {
      this.usernameValue = $event;
      valid = val.validateUsername($event);
      if (valid === true) {
        this.validationError.username = '';
      }
    } else if (type === 'email') {
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
    } else if (type === 'repeatPassword') {
      this.repeatPasswordValue = $event;
      valid = val.validateRepeatPassword(this.passwordValue, $event);
      if (valid === true) {
        this.validationError.repeatPassword = '';
      }
    }
    console.log('[ModelVal] Result for', type, 'is', valid);
  }


  public onBlurValidator(type: string) {
    let valid: boolean;
    const val = new Validation();

    if (type === 'username') {
      valid = val.validateUsername(this.usernameValue);
      if (valid === true) {
        this.validationError.username = '';
      } else {
        this.validationError.username = this.displayUsernameValidation(valid);
      }
    } else if (type === 'email') {
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

    } else if (type === 'repeatPassword') {
      valid = val.validateRepeatPassword(this.passwordValue, this.repeatPasswordValue);
      if (valid === true) {
        this.validationError.repeatPassword = '';
      } else {
        this.validationError.repeatPassword = this.displayRepeatPasswordValidation(valid);
      }
    }

    console.log('[BlurVal] Validated', type, 'as', valid);

  }


  public displayEmailValidation(validationResult: boolean, answer?: Answer): string {
    if (answer != null) {
      if (answer.code === 201) {
        return 'This email is already registered';
      }
    }
    if (!validationResult) {
      return 'Please enter a valid email';
    } else {
      return '';
    }
  }

  public displayUsernameValidation(validationResult: boolean): string {
    if (!validationResult) {
      return 'Please enter a valid Username';
    } else {
      return '';
    }
  }


  public displayPasswordValidation(validationResult: boolean): string {
    if (validationResult === true) {
      return '';
    } else if (validationResult === false) {
      return 'Please enter a valid Password';
    }
  }

  public displayRepeatPasswordValidation(validationResult: boolean, answer?: Answer): string {

    if (answer) {
      if (answer.code === 202) {
        return 'The passwords dont match';
      }
    }

    if (validationResult) {
      return '';
    } else {
      return 'The Passwords are not matching';
    }
  }


  public register(): void {
    console.log('[Register] Input Values: \"' + this.emailValue + '\" , \"' + this.usernameValue + '\" , \"' + this.passwordValue + '\" , \"' + this.repeatPasswordValue + '\"');
    const val = new Validation();

    const guiValidation = {
      email: val.validateEmail(this.emailValue),
      username: val.validateUsername(this.usernameValue),
      password: val.validatePassword(this.passwordValue),
      repeatPassword: val.validateRepeatPassword(this.passwordValue, this.repeatPasswordValue),
    };
    console.log('[GUIValidation]', guiValidation.email, guiValidation.username, guiValidation.password, guiValidation.repeatPassword);

    this.validationError.username = this.displayUsernameValidation(guiValidation.username);
    this.validationError.email = this.displayEmailValidation(guiValidation.email);
    this.validationError.password = this.displayPasswordValidation(guiValidation.password);
    this.validationError.repeatPassword = this.displayRepeatPasswordValidation(guiValidation.repeatPassword);


    if (!this.validationError.username && !this.validationError.email && !this.validationError.password && !this.validationError.repeatPassword) {

      console.log('[HTTP] Sending to backend...');
      const answer: Promise<Answer> = this.httpClient.post<Answer>('http://localhost:3000/api/register', {
        email: this.emailValue,
        username: this.usernameValue,
        password: this.passwordValue,
        repeatPassword: this.repeatPasswordValue
      }).toPromise();
      answer.then((answer) => {
        console.log('[HTTP] Answer recieved: Token:', answer.token, 'Validation:', answer.validation, 'successCode:', answer.code);

        if (answer.validation.email && answer.validation.username && answer.validation.password && answer.code == 1) {
          this.router.navigate(['/list']);
          this.cookieService.set('token', answer.token);
        } else {
          this.validationError.email = this.displayEmailValidation(answer.validation.email, answer);
          this.validationError.username = this.displayUsernameValidation(answer.validation.username);
          this.validationError.password = this.displayPasswordValidation(answer.validation.password);
          this.validationError.repeatPassword = this.displayRepeatPasswordValidation(answer.validation.repeatPassword);
        }
      });
    }
  }
}
