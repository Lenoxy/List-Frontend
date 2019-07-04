import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldValueChange, ValidationErrors} from '../class/validation';
import {UserLogin} from '../class/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() validationError: ValidationErrors = {};
  @Output() onLogin = new EventEmitter<UserLogin>();
  @Output() onValueChange = new EventEmitter<FieldValueChange>();
  @Output() onBlur = new EventEmitter<FieldValueChange>();

  emailValue = '';
  passwordValue = '';

  valueChange(field: string, value: string) {
    this.onValueChange.emit({
      field: field,
      value: value
    });
  }

  blur(field: string, value: string) {
    this.onBlur.emit({
      field: field,
      value: value
    });
  }

  login(): void {
    this.onLogin.emit({
      email: this.emailValue,
      password: this.passwordValue
    });
  }
}
