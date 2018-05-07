import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

/*
  Generated class for the AdminProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdminProvider {
  users: Observable<User[]>

  constructor(
    public http: Http,
    public db: AngularFireDatabase
  ) {
    console.log('Hello AdminProvider Provider');
  }

  getUsers() {
    this.users = this.db.list<User>('/users').valueChanges();
  }

}
