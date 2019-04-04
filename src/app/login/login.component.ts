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

  public emailValue: string;
  public passwordValue = '';
  public emailGuiReturn: string = '';
  public passwordGuiReturn: string = '';

  //TODO

  constructor(private httpClient: HttpClient, private router: Router) {
  }


  public onModelChangeValidator(type: string, $event) {
    const val = new InstantValidation();
    let value;

    if (type === 'email') {
      this.emailValue = $event;
      value = val.validateEmail($event);
      if (value === true) {
        this.emailGuiReturn = '';
      }
    } else if (type === 'password') {
      this.passwordValue = $event;
      value = val.validatePassword($event);
      if (value === true) {
        this.passwordGuiReturn = '';
      }
    }
    console.log('[ModelVal] Result for', type, 'is', value);
  }


  public onBlurValidator(type: string) {
    let value: boolean;
    const val = new Validation();
    if (type === 'email') {
      value = val.validateEmail(this.emailValue);
      this.displayEmailValidation(value);
    } else if (type === 'password') {
      value = val.validatePassword(this.passwordValue);
      this.displayPasswordValidation(value);
    }

    console.log('[BlurVal] Validated', type, 'as', value);
  }


  public displayEmailValidation(validationResult: boolean, answer?: Answer) {
    if (!validationResult) {
      this.emailGuiReturn = 'Please enter a valid email';
    } else {
      this.emailGuiReturn = '';
    }

    if (answer != null) {
      if (answer.code === 102) {
        this.emailGuiReturn = 'This email has not been registered yet';
      }
    }
  }

  public displayPasswordValidation(validationResult: boolean, answer?: Answer) {
    if (!validationResult) {
      this.passwordGuiReturn = 'Please enter a valid password';
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
