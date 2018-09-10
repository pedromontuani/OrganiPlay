import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';
import { AngularFireDatabase } from 'angularfire2/database';
import { Mundo } from '../../models/mundo.model';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { firebase } from 'firebase/database';

/*
  Generated class for the MundosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MundosProvider extends BaseProvider {

  constructor(public http: Http, public db: AngularFireDatabase) {
    super();
  }

  novoMundo(mundo: Mundo): Promise<void> {
    return this.db.list(`/mundos`)
      .push(mundo).transaction(() => { }, () => { })
      .catch(this.handlePromiseError);
  }

  getMundosObservable(uid: string): Observable<Mundo[]> {
    return this.mapListKeys(this.db.list(`/mundos`, ref => ref.orderByChild('players')))
      .map((mundos: Mundo[]) => {
        return mundos.filter(
          (mundo: Mundo) => {
            if (mundo.players) {
              mundo.players.toString().split(" ").indexOf(uid) != -1;
            }
          }
        );
      });
  }

  getMundosGmObservable(uid: string): Observable<Mundo[]> {
    return this.mapListKeys(this.db.list(`/mundos`, ref => ref.orderByChild('gmUID').equalTo(uid)));
  }

  getUsersList(uid: string): Observable<User[]> {
    return this.mapListKeys(this.db.list<User>('/users',
      (ref: firebase.database.Reference) => ref.orderByChild('username')))
      .map((users: User[]) => {
        return users.filter((user: User) => user.type !== "adm"
          && user.type !== "gamemaster"
          && user.$key !== uid
        );
      });
  }

}
