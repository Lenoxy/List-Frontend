import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {cookie} from '../../class/cookie';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnChanges {

  @Input() selectedList: string;
  public enabledInput: string;

  constructor(private cookieService: CookieService, private httpClient: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedList && this.selectedList) {
      this.getItems();
    }
  }

  ngOnInit() {
    this.getItems();
  }

  public itemNames: string[];


  public getItems() {
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());
    if (cookieObj.getCookie()) {
      const answer: Promise<string[]> = this.httpClient.post<string[]>(
        'limitless-peak-72031.herokuapp.com/api/items/get',
        {
          token: cookieObj.getCookie(),
          listName: this.selectedList,
        }
      ).toPromise();
      answer.then((answeredItemNames: string[]) => {
        this.itemNames = answeredItemNames;
      }).catch((e) => {
        console.log(e);
      });
    } else {
      console.log('[Cookie] User not logged in');
      //TODO Display Error
    }
  }

  public addItem(name: string, selectedList: string) {
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());
    if (cookieObj.getCookie()) {
      const answer: Promise<string> = this.httpClient.post<string>(
        'limitless-peak-72031.herokuapp.com/api/items/add',
        {
          token: cookieObj.getCookie(),
          name: name,
          forList: this.selectedList,
        }
      ).toPromise();

      answer.then(
        (answer: string) => {
          if (answer) {
            console.log('[Item-ADD] Item \"' + name + '\" created successfully');
            this.getItems();
          }
        }).catch(
        (answer: string) => {
          console.error('[Item-ADD] Error while creating \"' + name + '\"');
          console.log(answer);
          this.getItems();
        });
    } else {
      console.log('[Cookie] User not logged in');
    }
  }

  public deleteItem(name: string) {
    const cookieObj = new cookie(this.cookieService);
    if (cookieObj.getCookie()) {
      const answer: Promise<boolean> = this.httpClient.post<boolean>(
        'limitless-peak-72031.herokuapp.com/api/items/del',
        {
          token: cookieObj.getCookie(),
          name: name,
          forList: this.selectedList,
        }
      ).toPromise();
      answer.then(
        (answer: boolean) => {
          if (answer === true) {
            console.log('[List-DEL] List \"' + name + '\" deleted successfully');
            this.getItems();
          } else {
            console.error('[List-DEL] Error (Check entered name)');
          }
        }).catch(
        (answer: boolean) => {

          this.getItems();
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
    this.getItems();
  }


  public renameItem(newNameObj: any) {
    let oldName = this.enabledInput;
    this.enabledInput = null;
    const cookieObj = new cookie(this.cookieService);
    console.log('[Cookie] Value:', cookieObj.getCookie());

    if (cookieObj.getCookie()) {
      const answer: Promise<boolean> = this.httpClient.post<boolean>(
        'limitless-peak-72031.herokuapp.com/api/items/rename',
        {
          token: cookieObj.getCookie(),
          oldName: oldName,
          newName: newNameObj.target.value,
          forList: this.selectedList,
        }
      ).toPromise();
      answer.then(
        (answer) => {
          this.getItems();
          if (answer) {
            console.log('[List-RENAME] Rename successful');
          } else {
            console.error('[List-RENAME] Error while renaming List');
          }
        }).catch(
        () => {
          //TODO Display Error
        });
    } else {
      console.log('[Cookie] User not logged in');
    }
  }
}
