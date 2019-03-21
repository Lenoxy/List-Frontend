import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Answer} from '../answer';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public emailValue: string;
  public passwordValue = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  public login(): void {
    console.log('[HTTP] Input Values:' + this.emailValue, ',', this.passwordValue);

    const answer: Observable<Answer>  = this.httpClient.post<Answer>('http://localhost:3000/api/login' , {email: this.emailValue, password: this.passwordValue});

    answer.subscribe((answer) => {
      console.log('[HTTP] Answer recieved: ' + answer);
      console.log('Token:', answer.token, 'Validation:', answer.validation, 'isPasswordCorrect:', answer.isPasswordCorrect, 'InternalError:', answer.internalError);
    });
  }
}
