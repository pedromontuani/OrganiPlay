import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CadastrarPage } from '../cadastrar/cadastrar';
import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { AdminPage } from '../admin/admin';
import { User } from '../../models/user.model';
import { AdminProvider } from '../../providers/admin/admin';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;

  constructor(
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public formBuilder: FormBuilder, 
    public navParams: NavParams,
    public adminProvider: AdminProvider
  ) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    }); 
  }

  onSubmit() {
    let loading: Loading = this.showLoading();
    this.authProvider.signInWithEmail(this.loginForm.value)
      .then((isLogged: boolean) => {
        if(isLogged) {
          this.authProvider.setUid();
          this.userProvider.getUserById(this.authProvider.userUID);
          loading.dismiss();
          this.userProvider.currentUser
            .first()
            .subscribe((user: User) =>{
              if(user.type == "adm"){
                this.navCtrl.setRoot(AdminPage);
                this.adminProvider.getUsers();
              } else {
                this.navCtrl.setRoot(TabsPage);
              }
            });
        }
      }).catch((error: any) => {
        loading.dismiss();
        this.showAlert(error);
      });
  }

  private showLoading(): Loading{
    let loading: Loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loading.present();
    return loading;
  }

  private showAlert(message: string){
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

  onSignUp() {
    this.navCtrl.push(CadastrarPage);
  }

}
