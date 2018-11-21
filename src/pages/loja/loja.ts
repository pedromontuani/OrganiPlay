import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LojaProvider } from '../../providers/loja/loja';
import { Observable } from 'rxjs';
import { ItemLojaAvatar } from '../../models/item-loja-avatar.model';
import { ItemLojaPocao } from '../../models/item-loja-pocao.model';
import { ItemLojaTema } from '../../models/item-loja-tema.model';
import { ItemLojaBackground } from '../../models/item-loja-background.model';
import { ItensLojaUsuarios } from '../../models/itens-loja-usuarios.model';
import { AuthProvider } from '../../providers/auth/auth';
import { UserSettings } from '../../models/user-settings.model';
import { UserProvider } from '../../providers/user/user';
import { Status } from '../../models/status.model';

//@IonicPage()
@Component({
  selector: 'page-loja',
  templateUrl: 'loja.html',
})
export class LojaPage {

  avatares: Observable<ItemLojaAvatar[]>;
  pocoes: Observable<ItemLojaPocao[]>;
  temas: Observable<ItemLojaTema[]>;
  backgroundImgs: Observable<ItemLojaBackground[]>;
  view: string = "avatares";
  itensUsuario: ItensLojaUsuarios;
  userSettings: UserSettings;
  userStatus: Status;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lojaProvider: LojaProvider,
    public authProvider: AuthProvider,
    public userProvider: UserProvider
  ) {

    this.avatares = this.lojaProvider.getItensLoja("Avatar");
    this.pocoes = this.lojaProvider.getItensLoja("Pocao");
    this.lojaProvider.getItensUsuario(this.authProvider.userUID)
      .subscribe(itens => {
        this.itensUsuario = itens;
      });
    this.backgroundImgs = this.lojaProvider.getItensLoja("Wallpaper"); 
    this.temas = this.lojaProvider.getItensLoja("Tema");
    this.userProvider.currentUserObject
      .valueChanges()
      .first()
      .subscribe(user => {
        this.userSettings = user.settings;
        this.userStatus = user.status;
    });

  }

  isComprado(item: any): boolean {
    if (this.itensUsuario) {
      if (this.itensUsuario.avatares && item.tipo == "Avatar") {
        if (this.itensUsuario.avatares.split(" ").filter(value => {return value != " "}).indexOf(item.$key) != -1) {
          return true;
        }
      }

      if (this.itensUsuario.pocoes && item.tipo == "Pocao") {
        if (this.itensUsuario.pocoes.split(" ").filter(value => {return value != " "}).indexOf(item.$key) != -1) {
          return true;
        }
      }

      if (this.itensUsuario.temas && item.tipo == "Tema") {
        if (this.itensUsuario.temas.split(" ").filter(value => {return value != " "}).indexOf(item.$key) != -1) {
          return true;
        }
      }

      if (this.itensUsuario.wallpapers && item.tipo == "Wallpaper") {
        if (this.itensUsuario.wallpapers.split(" ").filter(value => {return value != " "}).indexOf(item.$key) != -1) {
          return true;
        }
      }
    }
    return false;
  }

  isUsando(item: any) {
    if (this.itensUsuario) {
      if (this.userSettings.currentAvatar && this.userSettings.currentAvatar == item.imgURL) {
        return true;
      }

      if (this.userSettings.currentTheme && this.userSettings.currentTheme == item.$key) {
        return true;
      }

      if (this.userSettings.currentWallpaper && this.userSettings.currentWallpaper == item.imgURL) {
        return true;
      }
    }
    return false;
  }

}
