import { Component, Input } from '@angular/core';
import { AlertController, App, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { BaseComponent } from '../base.component';
import { User } from '../../models/user.model';
import { AdmEditarUsuarioPage } from '../../pages/adm-editar-usuario/adm-editar-usuario';
import { EditarPerfilPage } from '../../pages/editar-perfil/editar-perfil';
import { MundosPage } from '../../pages/mundos/mundos';
import { LojaPage } from '../../pages/loja/loja';
import { AmigosPage } from '../../pages/amigos/amigos';

/**
 * Generated class for the UserMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent extends BaseComponent{

  text: string;
  @Input('user') currentUser: User;
  @Input('uid') currentUserUid: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController,
    public authProvider: AuthProvider,
  ) {
    super(alertCtrl, authProvider, app, menuCtrl);
    this.text = 'Hello World';
  }

  onProfile() {
    this.navCtrl = this.app.getActiveNavs()[0];
    this.navCtrl.push(EditarPerfilPage, {uid : this.currentUserUid});
  }

  onMundos() {
    this.navCtrl = this.app.getActiveNavs()[0];
    this.navCtrl.push(MundosPage);
  }

  onLoja(){
    this.navCtrl = this.app.getActiveNavs()[0];
    this.navCtrl.push(LojaPage);
  }

  onAmigos(){
    this.navCtrl = this.app.getActiveNavs()[0];
    this.navCtrl.push(AmigosPage, {settings : this.currentUser.settings});
  }
}
