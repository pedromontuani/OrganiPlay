import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ItensLojaUsuarios } from '../../models/itens-loja-usuarios.model';
import { Status } from '../../models/status.model';
import { UserProvider } from '../user/user';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';
import { NotificationsProvider } from '../notifications/notifications';

@Injectable()
export class LojaProvider extends BaseProvider {

  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    public userProvider: UserProvider,
    public device: Device,
    public notificationsProvider: NotificationsProvider,
    @Inject(FirebaseApp) public firebaseApp: any
  ) {
    super();
  }

  addItemLojaComFoto(item: any, base64: string): Promise<void> {
    return this.db.list(`itens-loja/${item.tipo}/`).push(item)
      .transaction(() => { }, (a, b, c) => {
        console.log(a);
        item.$key = c.key;
      })
      .then(() => {
        return firebase
          .storage()
          .ref()
          .child("itens-loja")
          .child(item.tipo)
          .child(item.$key)
          .putString(base64, 'base64', { contentType: 'image/jpeg' })
          .then((snapshot) => {
            return this.updateItemLoja(item, { imgURL: snapshot.downloadURL })
              .then(() => {
                if(item.tipo == "Pocao") {
                  this.notificationsProvider.sendNotification(
                    "Nova poção",
                    `A poção "${item.nome}" foi adicionada à loja`,
                    "global"
                  );
                } else {
                  let itemTipo: String = item.tipo;
                  this.notificationsProvider.sendNotification(
                    `Novo ${itemTipo.toLowerCase()}`,
                    `O ${itemTipo.toLowerCase()} "${item.nome}" foi adicionada à loja`,
                    "global"
                  );
                }
                
              })
              .catch(err => { return err });
          })
          .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
      })
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  updateItemLoja(item: any, data: any): Promise<void> {
    return this.db.object(`itens-loja/${item.tipo}/${item.$key}/`)
      .update(data)
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  getItensLoja(tipo: string): Observable<any> {
    return this.mapListKeys(this.db.list(`itens-loja/${tipo}`, ref => ref.orderByChild("nivel")));
  }


  updateItensUsuario(itensUsuario: any, uid: string): Promise<void> {
    return this.db.object(`inventario/${uid}`).update(itensUsuario)
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  getItensUsuario(uid: string): Observable<ItensLojaUsuarios> {
    return this.mapObjectKey(this.db.object(`inventario/${uid}`));
  }

  comprarItem(item: any, status: Status, uid: string): Promise<void> {
    return this.userProvider.updateStatus(status, status, uid)
      .then(() => {
        this.db.object<ItensLojaUsuarios>(`inventario/${uid}`)
          .valueChanges()
          .first()
          .subscribe(itensUsuario => {
            let newItens = new ItensLojaUsuarios("", "", "", "");
            if(itensUsuario) {
              newItens = itensUsuario;
            }
            if (item.tipo == "Avatar") {
              let itensVec: string[] = [];
              if (itensUsuario && itensUsuario.avatares) {
                itensVec = itensUsuario.avatares.split(" ").filter(value => {return value != " "});
              }
              itensVec.push(item.$key);
              newItens.avatares = itensVec.join(" ");
            } else if (item.tipo == "Pocao") {
              let itensVec: string[] = [];
              if (itensUsuario && itensUsuario.pocoes) {
                itensVec = itensUsuario.pocoes.split(" ").filter(value => {return value != " "});
              }
              itensVec.push(item.$key);
              newItens.pocoes = itensVec.join(" ");
            } else if (item.tipo == "Tema") {
              let itensVec: string[] = [];
              if (itensUsuario && itensUsuario.temas) {
                itensVec = itensUsuario.temas.split(" ").filter(value => {return value != " "});
              }
              itensVec.push(item.$key);
              newItens.temas = itensVec.join(" ");
            } else if (item.tipo == "Wallpaper") {
              let itensVec: string[] = [];
              if (itensUsuario && itensUsuario.wallpapers) {
                itensVec = itensUsuario.wallpapers.split(" ").filter(value => {return value != " "});
              }
              itensVec.push(item.$key);
              newItens.wallpapers = itensVec.join(" ");
            }
            this.updateItensUsuario(newItens, uid);
          })
      })
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  usarItem(item: any, uid: string, data: any): Promise<void> {
    if (item.tipo == "Avatar") {
      return this.userProvider.updateUserSettings({ currentAvatar: item.imgURL }, uid);
    } else if (item.tipo == "Pocao") {
      return this.updateItensUsuario({ pocoes : data ? data : "" }, uid);
    } else if (item.tipo == "Tema") {
      return this.userProvider.updateUserSettings({ currentTheme: item.$key }, uid);
    } else if (item.tipo == "Wallpaper") {
      return this.userProvider.updateUserSettings({ currentWallpaper: item.imgURL }, uid);
    }
  }
}