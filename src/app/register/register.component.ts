import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Answer} from '../answer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public emailValue: string;
  public usernameValue: string;
  public passwordValue: string;
  public repeatPasswordValue: string;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  public register(): void {


    console.log('Input Values:', this.emailValue, ',', this.usernameValue, ',', this.passwordValue, ',', this.repeatPasswordValue);

    const answer: Observable<Answer> = this.httpClient.post<Answer>('http://localhost:3000/api/register', {
      email: this.emailValue,
      username: this.usernameValue,
      password: this.passwordValue,
      repeatPassword: this.repeatPasswordValue
    });

    answer.subscribe((answer) => {
      console.log('Answer received: ' + answer);
    });
  }
}
