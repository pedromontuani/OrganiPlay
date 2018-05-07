import { Component } from '@angular/core';
import { AlertController, App, MenuController, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../../pages/login/login';
import { BaseComponent } from '../base.component';
/**
 * Generated class for the AdminHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'admin-header',
  templateUrl: 'admin-header.html'
})
export class AdminHeaderComponent extends BaseComponent{

  titulo: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController,
    public authProvider: AuthProvider,
  ) {
    super(alertCtrl, authProvider, app, menuCtrl);
    this.titulo = 'Administrador';
  }

}
