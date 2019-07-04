import {Injectable} from '@angular/core';

export interface AppState {
  loggedInUserEmail: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  state: AppState = {
    loggedInUserEmail: null,
  };
}
