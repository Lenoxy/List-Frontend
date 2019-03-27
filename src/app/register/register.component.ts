import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../class/answer';
import {Validation} from '../class/validation';
import {Router} from '@angular/router';

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

  constructor(private httpClient: HttpClient, private router: Router) {
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

  public displayUsernameValidation(validationResult: Boolean, answer?: Answer) {
    if (!validationResult) {
      this.usernameGuiReturn = 'Please enter a valid Username';
    } else {
      this.usernameGuiReturn = '';
    }
  }


  public displayPasswordValidation(validationResult: Boolean, answer?: Answer) {
    if (!validationResult) {
      this.passwordGuiReturn = 'Please enter a valid Password';
    } else {
      this.passwordGuiReturn = '';
    }

    if (answer != null) {
      if (answer.code === 202) {
        this.emailGuiReturn = 'The passwords dont match';
      }
    }
  }


  public register(): void {
    console.log('[Register] Input Values: \"' + this.emailValue + '\" , \"' + this.usernameValue + '\" , \"' + this.passwordValue + '\" , \"' + this.repeatPasswordValue + '\"');
    const val = new Validation();

    const guiValidation = {
      email: val.validateEmail(this.emailValue),
      username: val.validateUsername(this.usernameValue),
      password: val.validatePassword(this.passwordValue, this.repeatPasswordValue)
    };
    console.log('[GUIValidation]', guiValidation.email, guiValidation.username, guiValidation.password);

    if (guiValidation.password === null) {
      this.passwordGuiReturn = 'The passwords are not matching';
    } else {
      this.displayPasswordValidation(guiValidation.password);
    }
    this.displayEmailValidation(guiValidation.email);
    this.displayUsernameValidation(guiValidation.username);


    if (guiValidation.email == true && guiValidation.username == true && guiValidation.password == true) {

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
          this.displayPasswordValidation(answer.validation.password, answer);
        }


      }).catch(() => {
        console.log('[HTTP] Error while processing the request');

      });

    }


  }
}
