import {Component} from '@angular/core';
import {UserLogin} from '../../class/user';
import {FieldValueChange, Validation, ValidationErrors} from '../../class/validation';
import {cookie} from '../../class/cookie';
import {Answer} from '../../class/answer';
import {CookieService} from 'ngx-cookie-service';
import {InstantValidation} from '../../class/instantValidation';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AppStateService} from '../../services/app-state.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.css']
})
export class LoginContainerComponent {
  validationError: ValidationErrors = {};

  constructor(private cookieService: CookieService, private http: HttpClient, private router: Router, private appState: AppStateService) {
  }

  login(userLogin: UserLogin) {
    console.log('[Login] Input Values: \"' + userLogin.email + '\" , \"' + userLogin.password + '\"');
    const val = new Validation();
    let cookieObj = new cookie(this.cookieService);

    const guiValidation = {
      email: val.validateEmail(userLogin.email),
      password: val.validatePassword(userLogin.password)
    };
    console.log('[GUIValidation]', guiValidation.email, guiValidation.password);


    this.validationError.email = this.displayEmailValidation(guiValidation.email);
    this.validationError.password = this.displayPasswordValidation(guiValidation.password);

    if (!this.validationError.email && !this.validationError.password) {

      console.log('[HTTP] Sending to backend...');
      const answer: Promise<Answer> = this.http.post<Answer>(environment.api + '/api/login', userLogin).toPromise();

      answer.then((answer) => {
        console.log('[HTTP] Answer recieved: Token:', answer.token, 'Validation:', answer.validation, 'successCode:', answer.code);

        if (answer.validation.email && answer.validation.password && answer.code == 1) {
          this.router.navigate(['/list']);
          cookieObj.setCookie(answer.token);
          this.appState.state.loggedInUserEmail = userLogin.email;
        } else {
          this.validationError.email = this.displayEmailValidation(answer.validation.email, answer);
          this.validationError.password = this.displayPasswordValidation(answer.validation.password, answer);
        }
      });
    }
  }

  valueChange(fieldValueChange: FieldValueChange) {
    const val = new InstantValidation();
    let valid;

    if (fieldValueChange.field === 'email') {
      valid = val.validateEmail(fieldValueChange.value);
      if (valid) {
        this.validationError.email = '';
      }
    } else if (fieldValueChange.field === 'password') {
      valid = val.validatePassword(fieldValueChange.value);
      if (valid) {
        this.validationError.password = '';
      }
    }
    console.log('[ModelVal] Result for', fieldValueChange.field, 'is', valid);
  }

  blur(fieldValueChange: FieldValueChange) {
    let valid: boolean;
    const val = new Validation();
    if (fieldValueChange.field === 'email') {
      valid = val.validateEmail(fieldValueChange.value);
      if (valid) {
        this.validationError.email = '';
      } else {
        this.validationError.email = this.displayEmailValidation(valid);
      }
    } else if (fieldValueChange.field === 'password') {
      valid = val.validatePassword(fieldValueChange.value);
      if (valid === true) {
        this.validationError.password = '';
      } else {
        this.validationError.password = this.displayPasswordValidation(valid);
      }
    }

    console.log('[BlurVal] Validated', fieldValueChange.field, 'as', valid);
  }

  displayEmailValidation(validationResult: boolean, answer?: Answer) {

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

  displayPasswordValidation(validationResult: boolean, answer?: Answer) {

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
}
