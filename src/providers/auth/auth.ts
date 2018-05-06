import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BaseProvider } from '../base/base';

@Injectable()
export class AuthProvider extends BaseProvider{

  userUID: string;

  constructor(public auth: AngularFireAuth, public http: Http) {
    super();
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
