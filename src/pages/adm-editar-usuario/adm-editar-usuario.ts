import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AdminProvider } from '../../providers/admin/admin';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user';
import { BasePage } from '../base/base';

/**
 * Generated class for the AdmEditarUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-editar-usuario',
  templateUrl: 'adm-editar-usuario.html',
})
export class AdmEditarUsuarioPage extends BasePage{
  user: User;
  userUid: string;
  canEdit: boolean = false;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public adminProvider: AdminProvider,
      public userProvider: UserProvider,
      public alertController: AlertController,
      public loadingCtrl: LoadingController,
    ) {
      super(alertController, loadingCtrl, undefined);
  }

  ionViewWillLoad() {
    this.userUid = this.navParams.get('uid');
    this.adminProvider.getSingleUser(this.userUid).subscribe((user: User)=>{
      this.user = user;
      this.canEdit = true;
    });
  }

  onSubmit(){
    this.user.username = this.user.username.toLowerCase();
    this.userProvider.editUser(this.user, this.userUid)
      .then(() => {
        this.navCtrl.pop();
      })
      .catch(() => {
        this.showAlert("Ocorreu um erro. Tente novamente");
      });
  }

}
