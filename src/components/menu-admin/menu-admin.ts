import { Component, Input } from '@angular/core';
import { AlertController, App, MenuController, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../../pages/login/login';
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
export class MenuAdminComponent{

  @Input() titulo: string;
  protected navCtrl: NavController;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController,
    public authProvider: AuthProvider,
  ) {

  }
  
  onLogout(): void {
    this.navCtrl = this.app.getActiveNavs()[0];
    this.alertCtrl.create({
        message: 'Do you want to quit?',
        buttons: [
            {
                text: 'Yes',
                handler: () => {
                    this.authProvider.logout()
                        .then(() => {
                            this.navCtrl.setRoot(LoginPage);
                            this.menuCtrl.enable(false, 'user-menu');
                            this.menuCtrl.enable(false, 'menu-admin');
                        });
                }
            },
            {
                text: 'No'
            }
        ]
    }).present();
  }
  

}