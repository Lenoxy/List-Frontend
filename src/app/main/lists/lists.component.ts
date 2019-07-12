import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {cookie} from '../../class/cookie';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {AppStateService} from '../../services/app-state.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {


  @Output() setList = new EventEmitter<string>();
  public listNames: string[];
  public selectedList: string;
  public enabledInput: string;

  constructor(private httpClient: HttpClient, private cookieService: CookieService, public appState: AppStateService) {
  }

  ngOnInit() {
    this.getLists();
  }

  public getLists() {
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());
    if (cookieObj.getCookie()) {
      const answer: Promise<any> = this.httpClient.post<object>(
        'https://limitless-peak-72031.herokuapp.com/api/lists/get',
        {
          token: cookieObj.getCookie()
        }
      ).toPromise();
      answer.then((answeredListNames: string[]) => {
        this.listNames = answeredListNames;
      });
    } else {
      console.log('[Cookie] User not logged in');
    }
  }

  switchSelectedList(name: string) {
    this.selectedList = name;
    this.setList.emit(name);
  }


  public addList(name: string) {
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());
    if (cookieObj.getCookie()) {
      const answer: Promise<string> = this.httpClient.post<string>(
        'https://limitless-peak-72031.herokuapp.com/api/lists/add',
        {
          token: cookieObj.getCookie(),
          name: name,
        }
      ).toPromise();
      answer.then(
        (answer: string) => {
          if (answer) {
            console.log('[List-ADD] List \"' + name + '\" created successfully');
            this.selectedList = name;
            this.getLists();
          }
        }).catch(
        (answer: string) => {
          this.getLists();
        });
    } else {
      console.log('[Cookie] User not logged in');
    }
  }

  public onRenamePress(oldName: string) {
    this.enabledInput = oldName;
  }

  public onRenameBlur() {
    this.enabledInput = null;
    this.getLists();
  }


  public renameList(newNameObj: any) {
    let oldName = this.enabledInput;
    this.enabledInput = null;
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());

    if (cookieObj.getCookie()) {
      const answer: Promise<boolean> = this.httpClient.post<boolean>(
        'https://limitless-peak-72031.herokuapp.com/api/lists/rename',
        {
          oldName: oldName,
          newName: newNameObj.target.value,
          token: cookieObj.getCookie(),
        }
      ).toPromise();
      answer.then(
        (answer) => {
          this.getLists();
          if (answer) {
            console.log('[List-RENAME] Rename successful');
          } else {
            console.error('[List-RENAME] Error while renaming List');
          }
        }).catch(
        () => {
          this.getLists();
        });
    } else {
      console.log('[Cookie] User not logged in');
    }
  }

  public deleteList(name: string) {

    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      const answer: Promise<boolean> = this.httpClient.post<boolean>(
        'https://limitless-peak-72031.herokuapp.com/api/lists/del',
        {
          token: cookieObj.getCookie(),
          name: name,
        }
      ).toPromise();
      answer.then(
        (answer: boolean) => {
          if (answer === true) {
            console.log('[List-DEL] List \"' + name + '\" deleted successfully');
            this.getLists();
          } else {
            console.error('[List-DEL] Error (Check entered name)');
          }
        }).catch(
        () => {
          this.getLists();
        });
    } else {
      console.log('[Cookie] User not logged in');
    }

  }
}
