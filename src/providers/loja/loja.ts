import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { BaseProvider } from '../base/base';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ItensLojaUsuarios } from '../../models/itens-loja-usuarios.model';

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
    return this.db.list(`itens-loja/${item.tipo}/`).push(item)
      .transaction(() => {}, (a,b,c) => {
        console.log(a);
        item.$key = c.key;
      })
      .then(() => {
        return firebase
          .storage()
          .ref()
          .child("itens-loja")
          .child(item.$key)
          .putString(base64, 'base64', { contentType: 'image/jpeg' })
          .then((snapshot) => {
            item.$key 
            return this.updateItemLoja(item, {imgURL: snapshot.downloadURL})
              .catch(err => { return err });
          })
          .catch(this.handlePromiseError);
      })
      .catch(this.handlePromiseError);
  }

  updateItemLoja(item: any, data: any): Promise<void> {
    return this.db.object(`itens-loja/${item.tipo}/${item.$key}/`)
      .update(data)
      .catch(this.handlePromiseError);
  }

  getItensLoja(tipo: string): Observable<any> {
    return this.mapListKeys(this.db.list(`itens-loja/${tipo}`));
  }

  comprarItem(itensUsuario: ItensLojaUsuarios, uid: string): Promise<void> {
    return this.db.object(`inventario/${uid}`).update(itensUsuario)
      .catch(this.handlePromiseError);
  }

  getItensUsuario(uid: string): Observable<ItensLojaUsuarios> {
    return this.mapObjectKey(this.db.object(`inventario/${uid}`));
  }
}