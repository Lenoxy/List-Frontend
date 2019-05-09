import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {cookie} from '../../class/cookie';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {


  @Output() setList = new EventEmitter<string>();

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.getLists();
  }

  public listNames: string[];
  public selectedList: string;
  //In order to disable the textboxes, this variable contains the name of the input, wich is beeing renamed just now.
  public enabledInput: string;
  public oldNameOfVariableBeeingRenamed: string;


  public getLists() {
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());
    if (cookieObj.getCookie()) {
      const answer: Promise<any> = this.httpClient.post<object>(
        'http://localhost:3000/api/lists/get',
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
        'http://localhost:3000/api/lists/add',
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
    console.log('--rename', oldName);
    this.enabledInput = oldName;
  }


  public renameList(newName: string) {

    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());
    if (cookieObj.getCookie()) {
      const answer: Promise<string> = this.httpClient.post<string>(
        'http://localhost:3000/api/lists/rename',
        {
          oldName: this.oldNameOfVariableBeeingRenamed,
          newName: newName,
          token: cookieObj.getCookie(),
        }
      ).toPromise();
      answer.then(
        (answer: string) => {
          if (answer) {
            console.log('[List-RENAME] List renamed to \"' + answer + '\"');
            this.getLists();
          } else {
            console.error('[List-RENAME] Error (Check entered name)');
            this.getLists();
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
        'http://localhost:3000/api/lists/del',
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
        (answer: boolean) => {

          this.getLists();
        });
    } else {
      console.log('[Cookie] User not logged in');
    }

  }
}
