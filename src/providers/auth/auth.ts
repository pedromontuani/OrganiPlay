import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BaseProvider } from '../base/base';
import { MenuController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthProvider extends BaseProvider{

  userUID: string;

  constructor(public auth: AngularFireAuth, public http: Http, public menuCtrl: MenuController, public db: AngularFireDatabase) {
    super(db);
    this.auth.auth.useDeviceLanguage();
  }

  createAuthUser(user: {email: string, password: string}): Promise<any>{
    return this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }

  signInWithEmail(user: {email: string, password: string}): Promise<any> {
    return this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(()=>{
        return this.auth.auth.currentUser != null;
      }).catch(this.handlePromiseError);
  }

  logout(): Promise<void>{
    this.menuCtrl.enable(false, "user-menu");
    this.menuCtrl.enable(false, "menu-admin");
    return this.auth.auth.signOut();
  }

  setUid() {
    this.userUID = this.auth.auth.currentUser.uid;
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.authState
        .first()
        .subscribe((authState) => {
          if(authState){
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  }

}
