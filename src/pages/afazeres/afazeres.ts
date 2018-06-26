import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user';
import { Status } from '../../models/status.model';
import { NovoAfazerPage } from '../novo-afazer/novo-afazer';
import { Afazer } from '../../models/afazer.model';
import { AfazeresProvider } from '../../providers/afazeres/afazeres';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';
import { BasePage } from '../base/base';

/**
 * Generated class for the AfazeresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-afazeres',
  templateUrl: 'afazeres.html',
})
export class AfazeresPage extends BasePage {
  public title: string = "Afazeres";
  public afazeres: Observable<Afazer[]>
  public user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public authProvider: AuthProvider,
    public afazeresProvider: AfazeresProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    super(alertCtrl, undefined, toastCtrl);
  }

  ionViewWillLoad() {
    this.user = this.userProvider.userSubscribe;
    this.sync();
    this.afazeres = this.afazeresProvider.getAfazeresObservable(this.authProvider.userUID);
  }

  sync() {
    this.userProvider.currentUserObject
      .valueChanges()
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  public novoAfazer() {
    this.navCtrl.push(NovoAfazerPage);
  }

  public finalizarTarefa(afazer: Afazer) {
    this.alertCtrl.create({
      message: "Quer finalizar esta tarefa??",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.afazeresProvider.finalizarAfazer(afazer.$key, this.authProvider.userUID);
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();

  }


}
