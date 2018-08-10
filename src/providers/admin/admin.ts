import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { BaseProvider } from '../base/base';
import { firebase } from 'firebase/database';

/*
  Generated class for the AdminProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdminProvider extends BaseProvider{

  usersList: Observable<User[]>;

  constructor(
    public http: Http,
    public db: AngularFireDatabase
  ) {
    super();
    console.log('Hello AdminProvider Provider');
  }

  getUsers() {
    this.usersList = this.mapListKeys(this.db.list<User>('/users', 
    (ref: firebase.database.Reference) => ref.orderByChild('name')))
      .map((users: User[]) => {      
        return users.filter((user: User) => user.type !== "adm");
      });
  }

  getSingleUser(uid: string): Observable<User>{
    return this.db.object<User>(`/users/${uid}`)
      .valueChanges();
  }

}
