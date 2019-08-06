import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {cookie} from '../../class/cookie';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {ErrorService} from '../../services/error.service';
import {environment} from '../../../environments/environment';

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

  constructor(private httpClient: HttpClient, private cookieService: CookieService, public errorService: ErrorService) {
  }

  ngOnInit() {
    this.getLists();
  }

  public getLists() {
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());
    if (cookieObj.getCookie()) {
      this.httpClient.post<string[]>(
        environment.api + '/api/lists/get',
        {
          token: cookieObj.getCookie()
        }
      ).toPromise()
        .then((answeredListNames: string[]) => {
          this.listNames = answeredListNames;
        })
        .catch(() => {
          console.log('[List-GET] User not logged in');
          this.errorService.alertAndRedirect('Please register or log in to use List');
        });
    } else {
      console.log('[Cookie] User not logged in');
      this.errorService.alertAndRedirect('Please register or log in to use List');
    }
  }

  switchSelectedList(name: string) {
    this.selectedList = name;
    this.setList.emit(name);
  }


  public addList(name: string) {
    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      const answer: Promise<void> = this.httpClient.post<void>(
        environment.api + '/api/lists/add',
        {
          token: cookieObj.getCookie(),
          name: name,
        }
      ).toPromise();
      answer.then(
        () => {
          console.log('[List-ADD] List \"' + name + '\" created successfully');
          this.selectedList = name;
          this.getLists();
        }).catch(
        () => {
          this.errorService.alert('Could not add List  HINT: You can not have two Lists with the same name.');
        });
    } else {
      console.log('[Cookie] User not logged in');
      this.errorService.alertAndRedirect('Please register or log in to use List');
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

    if (cookieObj.getCookie()) {
      const answer: Promise<void> = this.httpClient.post<void>(
        environment.api + '/api/lists/rename',
        {
          oldName: oldName,
          newName: newNameObj.target.value,
          token: cookieObj.getCookie(),
        }
      ).toPromise().then(
        () => {
          console.log('[List-RENAME] Rename successful');
          this.getLists();
        }).catch(
        () => {
          console.error('[List-RENAME] Error while renaming List');
          this.errorService.alert('Could not rename List HINT: You can not have two Lists with the same name.');
        });
    } else {
      console.log('[Cookie] User not logged in');
      this.errorService.alertAndRedirect('Please register or log in to use List');
    }
  }

  public deleteList(name: string) {

    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      this.httpClient.post<boolean>(
        environment.api + '/api/lists/del',
        {
          token: cookieObj.getCookie(),
          name: name,
        }
      ).toPromise()
        .then(
          () => {
            console.log('[List-DEL] List \"' + name + '\" deleted successfully');
            this.selectedList = null;
            this.setList.emit(name);
            this.getLists();
          }).catch(
        () => {
          console.error('[List-DEL] Error while deleting list');
          this.errorService.alert('Could not delete List. HINT: Delete the Items before deleting the List');
        });
    } else {
      console.log('[Cookie] User not logged in');
      this.errorService.alertAndRedirect('Please register or log in to use List');
    }

  }
}
