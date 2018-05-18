import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';

import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { User } from '../../models/user.model';
import { AuthProvider } from '../auth/auth';



@Injectable()
export class UserProvider extends BaseProvider {

  currentUser: Observable<User>;
  currentUserObject: AngularFireObject<User>;
  type: string;

  constructor(
    public db: AngularFireDatabase,
    public http: Http,
    public authService: AuthProvider
  ) {
    super();

  }

  create(user:User, uid: string): Promise<void>{
    user = new User(
      user.name,
      user.username,
      user.email,
      undefined,
      "player"
    );
    return this.db.object('/users/'+uid)
      .set(user)
      .catch(this.handlePromiseError);
  }

  userExists(username: string): Observable<boolean>{
    return this.db.list('/users', ref => ref.orderByChild("username").equalTo(username)
    ).valueChanges()
    .map((users: User[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }

  getUserById(uid: string) {
    this.currentUserObject = this.db.object(`/users/${uid}`);
    this.currentUser = this.currentUserObject.valueChanges();
  }

  editUser(user: User, uid: string): Promise<void>{
    return this.db.object(`/users/${uid}`)
      .update(user)
      .catch(this.handlePromiseError);
  }

  get isAdmin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.currentUser
        .first()
        .subscribe((user: User) => {
          this.type = user.type;
          if(user.type == "adm"){
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  }
}