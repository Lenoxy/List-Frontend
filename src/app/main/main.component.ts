import {Component} from '@angular/core';
import {AppStateService} from '../services/app-state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(public appState: AppStateService) {
  }
}
