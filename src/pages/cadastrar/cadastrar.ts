import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { BasePage } from '../base/base';

/**
 * Generated class for the CadastrarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastrar',
  templateUrl: 'cadastrar.html',
})
export class CadastrarPage extends BasePage{
  public signUpForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    super(alertCtrl, loadingCtrl);
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
  }

  onSubmit() {
    let formUser = this.signUpForm.value;

    if (formUser.password == formUser.passwordConfirm) {
      let loading: Loading = this.showLoading();
      delete formUser.passwordConfirm;
      this.userProvider.userExists(formUser.username)
        .first()
        .subscribe((userExists: boolean) => {
          if (!userExists) {
            this.authProvider.createAuthUser({
              email: formUser.email,
              password: formUser.password
            }).then(() => {
              delete formUser.password;
              let uid = this.authProvider.auth.auth.currentUser.uid;
              this.userProvider.create(formUser, uid).then(() => {
                console.log("Usuário cadastrado");
                this.userProvider.getUserById(uid);
                loading.dismiss();
                this.navCtrl.setRoot(TabsPage);
              }).catch((error: any) => {
                console.log(error);
                loading.dismiss();
                this.showAlert(error);
              });
            }).catch((error: any) => {
              console.log(error);
              loading.dismiss();
              this.showAlert(error);
            });

          } else {
            loading.dismiss();
            this.showAlert('O usuário "' + formUser.username + '" já existe');
          }
        });
    } else {
      this.showAlert("As senhas não coincidem.");
    }

  }

}
