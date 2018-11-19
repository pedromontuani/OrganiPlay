import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Mundo } from '../../models/mundo.model';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { MundosProvider } from '../../providers/mundos/mundos';
import { NovoMundoUsuariosPage } from '../GameMaster/novo-mundo-usuarios/novo-mundo-usuarios';
import { GerenciarMundoPage } from '../GameMaster/gerenciar-mundo/gerenciar-mundo';
import { AcessarMundoPage } from '../acessar-mundo/acessar-mundo';
import { BasePage } from '../base/base';


//@IonicPage()
@Component({
  selector: 'page-mundos',
  templateUrl: 'mundos.html',
})

export class MundosPage extends BasePage{

  view: string = "mundos";
  userUID: string;
  mundos: Observable<Mundo[]>
  meusMundos: Observable<Mundo[]>
  isGM: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public mundosProvider: MundosProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public mundoProvider: MundosProvider
  ) {
    super(alertCtrl, loadingCtrl, toastCtrl);
    this.userUID = this.authProvider.userUID;
    if (this.userProvider.type == "gamemaster") {
      this.isGM = true;
      this.meusMundos = this.mundosProvider.getMundosGmObservable(this.userUID);
    }
    this.mundos = this.mundosProvider.getMundosObservable(this.userUID);
  }

  onClickMundo(mundo: Mundo) {
    this.navCtrl.push(
      AcessarMundoPage,
      { mundo: mundo },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  onClickMundoGM(mundo: Mundo) {
    this.navCtrl.push(
      GerenciarMundoPage,
      { mundo: mundo },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  addMundo() {
    this.navCtrl.push(NovoMundoUsuariosPage, { uid: this.userUID });
  }

  onPressMundo(mundo: Mundo) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Sair do mundo',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.alertCtrl.create({
              message: "Deseja sair deste mundo?",
              buttons: [
                {
                  text: "Sim",
                  handler: () => {
                    let loading = this.showLoading();
                    this.mundoProvider.excluirUsuario(this.userUID, mundo.$key, mundo.players)
                      .then(() => {
                        loading.dismiss();
                        this.showToast("Você deixou este mundo!");
                      })
                      .catch(err => {
                        console.log(err);
                        loading.dismiss();
                        this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
                      });
                  }
                },
                {
                  text: "Não"
                }
              ]
            }).present();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {

          }
        }
      ]
    }).present();
  }

  onPressMundoGM(mundo: Mundo) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Excluir mundo',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.alertCtrl.create({
              message: "Deseja excluir este mundo? Todos os dados serão perdidos!",
              buttons: [
                {
                  text: "Sim",
                  handler: () => {
                    let loading = this.showLoading();
                    this.mundoProvider.excluirMundo(mundo.$key)
                      .then(() => {
                        loading.dismiss();
                        this.showToast("Mundo excluído com sucesso!");
                      })
                      .catch(err => {
                        console.log(err);
                        loading.dismiss();
                        this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
                      });
                  }
                },
                {
                  text: "Não"
                }
              ]
            }).present();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {

          }
        }
      ]
    }).present();
  }

}
