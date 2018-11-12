import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { BaseProvider } from '../base/base';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ItensLojaUsuarios } from '../../models/itens-loja-usuarios.model';
import { Status } from '../../models/status.model';
import { UserProvider } from '../user/user';

@Injectable()
export class LojaProvider extends BaseProvider {

  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    public userProvider: UserProvider,
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
          .child(item.$key)
          .putString(base64, 'base64', { contentType: 'image/jpeg' })
          .then((snapshot) => {
            item.$key
            return this.updateItemLoja(item, { imgURL: snapshot.downloadURL })
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


  updateItensUsuario(itensUsuario: any, uid: string): Promise<void> {
    return this.db.object(`inventario/${uid}`).update(itensUsuario)
      .catch(this.handlePromiseError);
  }

  getItensUsuario(uid: string): Observable<ItensLojaUsuarios> {
    return this.mapObjectKey(this.db.object(`inventario/${uid}`));
  }

  comprarItem(item: any, status: Status, uid: string): Promise<void> {
    return this.userProvider.updateStatus(status, uid)
      .then(() => {
        this.db.object<ItensLojaUsuarios>(`inventario/${uid}`)
          .valueChanges()
          .first()
          .subscribe(itensUsuario => {
            let newItens = new ItensLojaUsuarios("", "", "", "");
              if (item.tipo == "Avatar") {
                let itensVec: string[] = [];
                if(itensUsuario && itensUsuario.avatares != null){
                  itensVec = itensUsuario.avatares.split(" ");
                }
                itensVec.push(item.$key);
                newItens.avatares = itensVec.join(" ");
              } else if (item.tipo == "Pocao") {
                let itensVec: string[] = [];
                if(itensUsuario && itensUsuario.pocoes != null){
                  itensVec = itensUsuario.pocoes.split(" ");
                }
                itensVec.push(item.$key);
                newItens.pocoes = itensVec.join(" ");
              } else if (item.tipo == "Tema") {
                let itensVec: string[] = [];
                if(itensUsuario && itensUsuario.temas != null){
                  itensVec = itensUsuario.temas.split(" ");
                }
                itensVec.push(item.$key);
                newItens.temas = itensVec.join(" ");
              } else if (item.tipo == "Wallpaper") {
                let itensVec: string[] = [];
                if(itensUsuario && itensUsuario.wallpapers != null){
                  itensVec = itensUsuario.wallpapers.split(" ");
                }
                itensVec.push(item.$key);
                newItens.wallpapers = itensVec.join(" ");
              }
              this.updateItensUsuario(newItens, uid);
          })
      })
      .catch(this.handlePromiseError);
  }

  usarItem(item: any, uid: string): Promise<void> {
    if(item.tipo == "Avatar") {
      return this.userProvider.updateUserSettings({currentAvatar : item.imgURL}, uid);
    } else if(item.tipo == "Pocao") {
      this.userProvider.getUserStatus(uid).first().subscribe(status => {
        let newStatus = status;
        if((newStatus.hp + item.hp) > this.userProvider.getHPNivel(status.xp)){
          newStatus.hp = this.userProvider.getHPNivel(status.xp)
        } else {
          newStatus.hp += item.hp;
        }
        this.getItensUsuario(uid).first().subscribe(itens => {
          let pocoes: string[] = [];
          itens.pocoes.split(" ").forEach(pocao => {
            if(pocao != item.$key) {
              pocoes.push(pocao);
            }
          })
          return this.updateItensUsuario({pocoes : pocoes.join(" ")}, uid);
        })
      })
      
    } else if(item.tipo == "Tema") {
      return this.userProvider.updateUserSettings({currentTheme : item.$key}, uid);
    } else if(item.tipo == "Wallpaper") {
      return this.userProvider.updateUserSettings({currentWallpaper : item.imgURL}, uid);
    }
  }
}