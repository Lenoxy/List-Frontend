import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {cookie} from '../../class/cookie';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from '../../services/error.service';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnChanges {

  @Input() selectedList: string;
  public enabledInput: string;
  public itemNames: string[];

  constructor(private cookieService: CookieService, private httpClient: HttpClient, private errorService: ErrorService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedList && this.selectedList) {
      this.getItems();
    }
  }

  ngOnInit() {
    this.getItems();
  }


  public getItems() {
    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      const answer: Promise<string[]> = this.httpClient.post<string[]>(
        environment.api + '/api/items/get',
        {
          token: cookieObj.getCookie(),
          listName: this.selectedList,
        }
      ).toPromise();
      answer.then((answeredItemNames: string[]) => {
        this.itemNames = answeredItemNames;
      }).catch((e) => {
        console.log('[Items-GET] Error:', e);
      });
    } else {
      console.log('[Cookie] User not logged in');
      //No AlertAndRedirect, Items can't be loaded after initial Login
    }
  }

  public addItem(name: string) {
    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      this.httpClient.post<string>(
        environment.api + '/api/items/add',
        {
          token: cookieObj.getCookie(),
          name: name,
          forList: this.selectedList,
        }
      ).toPromise()
        .then(
          () => {
            console.log('[Item-ADD] Item \"' + name + '\" created successfully');
            this.getItems();
          }).catch(
        () => {
          console.error('[Item-ADD] Error while creating \"' + name + '\"');
          this.errorService.alert('Could not add Item. HINT: The Items name has to be unique in this List.');
          this.getItems();
        });
    } else {
      console.log('[Cookie] User not logged in');
      this.errorService.alertAndRedirect('Please register or log in to use List');
    }
  }

  public deleteItem(name: string) {
    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      this.httpClient.post<void>(
        environment.api + '/api/items/del',
        {
          token: cookieObj.getCookie(),
          name: name,
          forList: this.selectedList,
        }
      ).toPromise()
        .then(
          () => {
            console.log('[Item-DEL] List \"' + name + '\" deleted successfully');
            this.getItems();
          })
        .catch(
          () => {
            console.error('[Item-DEL] List \"' + name + '\" could not be deleted');
            this.errorService.alert('Could not delete Item');
            this.getItems();
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
    this.getItems();
  }


  public renameItem(newNameObj: any) {
    let oldName = this.enabledInput;
    this.enabledInput = null;
    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      this.httpClient.post<boolean>(
        environment.api + '/api/items/rename',
        {
          token: cookieObj.getCookie(),
          oldName: oldName,
          newName: newNameObj.target.value,
          forList: this.selectedList,
        }
      ).toPromise()
        .then(
          () => {
            console.log('[List-RENAME] Rename successful');
            this.getItems();
          })
        .catch(
          () => {
            console.error('[List-RENAME] Error while renaming Item');
            this.errorService.alert('Error while renaming Item. HINT: You can not have two Items with the same name.');
            this.getItems();
          });
    } else {
      console.log('[Cookie] User not logged in');
      this.errorService.alertAndRedirect('Please register or log in to use List');
    }
  }
}
