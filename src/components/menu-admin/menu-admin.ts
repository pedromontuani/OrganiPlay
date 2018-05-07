import { Component, Input } from '@angular/core';
import { AlertController, App, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { BaseComponent } from '../base.component';
import { User } from '../../models/user.model';
/**
 * Generated class for the MenuAdminComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu-admin',
  templateUrl: 'menu-admin.html'
})
export class MenuAdminComponent extends BaseComponent{

  @Input() titulo: string;
  @Input('user') currentUser: User;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController,
    public authProvider: AuthProvider,
  ) {
    super(alertCtrl, authProvider, app, menuCtrl);

  }

}