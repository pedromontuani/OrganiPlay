import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { BaseProvider } from '../base/base';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class LojaProvider extends BaseProvider {

  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    @Inject(FirebaseApp) public firebaseApp: any
  ) {
    super();
  }

  addItemLojaComFoto(item: any, base64: string): Promise<void> {
    let $key: string;
    return this.db.list(`itens-loja`).push(item)
      .transaction(() => {}, (a,b,c) => {
        console.log(a);
        $key = c.key;
      })
      .then(() => {
        return firebase
          .storage()
          .ref()
          .child("itens-loja")
          .child($key)
          .putString(base64, 'base64', { contentType: 'image/jpeg' })
          .then((snapshot) => {
            return this.updateItemLoja($key, {imgURL: snapshot.downloadURL})
              .catch(err => { return err });
          })
          .catch(this.handlePromiseError);
      })
      .catch(this.handlePromiseError);
  }

  updateItemLoja($key: string, data: any): Promise<void> {
    return this.db.object(`itens-loja/${$key}`)
      .update(data)
      .catch(this.handlePromiseError);
  }
}