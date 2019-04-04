import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../class/answer';
import {Validation} from '../class/validation';
import {Router} from '@angular/router';
import {InstantValidation} from '../class/instantValidation';

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

  public emailGuiReturn: string = '';
  public usernameGuiReturn: string = '';
  public passwordGuiReturn: string = '';
  public repeatPasswordGuiReturn: string = '';

  constructor(private httpClient: HttpClient, private router: Router) {
  }


  public onModelChangeValidator(type: string, $event) {
    const val = new InstantValidation();
    let value;

    if (type === 'username') {
      this.usernameValue = $event;
      value = val.validateUsername($event);
      if (value === true) {
        this.usernameGuiReturn = '';
      }
    } else if (type === 'email') {
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
    } else if (type === 'repeatPassword') {
      this.repeatPasswordValue = $event;
      value = val.validateRepeatPassword(this.passwordValue, $event);
      if (value === true) {
        this.repeatPasswordGuiReturn = '';
      }
    }
    console.log('[ModelVal] Result for', type, 'is', value);
  }


  public onBlurValidator(type: string) {
    let value: boolean;
    const val = new Validation();

    if (type === 'username') {
      value = val.validateUsername(this.usernameValue);
      this.displayUsernameValidation(value);

    } else if (type === 'email') {
      value = val.validateEmail(this.emailValue);
      this.displayEmailValidation(value);
    } else if (type === 'password') {
      value = val.validatePassword(this.passwordValue);
      this.displayPasswordValidation(value);
    } else if (type === 'repeatPassword') {
      value = val.validateRepeatPassword(this.passwordValue, this.repeatPasswordValue);
      this.displayRepeatPasswordValidation(value);
    }

    console.log('[BlurVal] Validated', type, 'as', value);

  }


  public displayEmailValidation(validationResult: Boolean, answer?: Answer) {
    if (!validationResult) {
      this.emailGuiReturn = 'Please enter a valid email';
    } else {
      this.emailGuiReturn = '';
    }

    if (answer != null) {
      if (answer.code === 201) {
        this.emailGuiReturn = 'This email is already registered';
      }
    }
  }

  public displayUsernameValidation(validationResult: boolean) {
    if (!validationResult) {
      this.usernameGuiReturn = 'Please enter a valid Username';
    } else {
      this.usernameGuiReturn = '';
    }
  }


  public displayPasswordValidation(validationResult: boolean) {
    if (validationResult === true) {
      this.passwordGuiReturn = '';
    } else if (validationResult === false) {
      this.passwordGuiReturn = 'Please enter a valid Password';
    }
  }

  public displayRepeatPasswordValidation(validationResult: boolean, answer?: Answer) {
    if (validationResult) {
      this.repeatPasswordGuiReturn = '';
    } else {
      this.repeatPasswordGuiReturn = 'The Passwords are not matching';
    }

    if (answer) {
      if (answer.code === 202) {
        this.passwordGuiReturn = 'The passwords dont match';
      }
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

    if (guiValidation.repeatPassword === false) {
      this.repeatPasswordGuiReturn = 'The passwords are not matching';
    } else {
      this.displayPasswordValidation(guiValidation.password);
    }
    this.displayEmailValidation(guiValidation.email);
    this.displayUsernameValidation(guiValidation.username);


    if (guiValidation.email === true && guiValidation.username === true && guiValidation.password === true) {

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
        } else {
          this.displayEmailValidation(answer.validation.email, answer);
          this.displayUsernameValidation(answer.validation.username);
          this.displayPasswordValidation(answer.validation.password);
          this.displayRepeatPasswordValidation(answer.validation.repeatPassword);
        }
      }).catch(() => {
        console.log('[HTTP] Error while processing the request');
      });
    }
  }
}
