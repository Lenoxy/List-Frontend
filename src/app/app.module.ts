import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MainComponent} from './main/main.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LandingComponent} from './landing/landing.component';
import {RouterModule, Routes} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ListsComponent} from './main/lists/lists.component';
import {ItemsComponent} from './main/items/items.component';
import {AppContainerComponent} from './container/app-container/app-container.component';
import {LoginContainerComponent} from './container/login-container/login-container.component';

const appRoutes: Routes = [
  {path: 'list', component: MainComponent},
  {path: 'login', component: LoginContainerComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', component: LandingComponent},
  {path: '**', component: PageNotFoundComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MainComponent,
    PageNotFoundComponent,
    LandingComponent,
    ListsComponent,
    ItemsComponent,
    AppContainerComponent,
    LoginContainerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // Debugging
    )
  ],
  providers: [CookieService],
  bootstrap: [AppContainerComponent]
})
export class AppModule {
}
