import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { Status } from '../../models/status.model';
import { UserProvider } from '../../providers/user/user';
import { NovoHabitoPage } from '../novo-habito/novo-habito';
import { Habito } from '../../models/habito.model';
import { HabitosProvider } from '../../providers/habitos/habitos';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs/Observable';
import { BasePage } from '../base/base';

/**
 * Generated class for the HabitosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-habitos',
  templateUrl: 'habitos.html',
})
export class HabitosPage extends BasePage{
  habitos: Observable<Habito[]>;
  user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public habitoProvider: HabitosProvider,
    public authProvider: AuthProvider,
    public toastCtrl: ToastController
  ) {
    super(undefined, undefined, toastCtrl);
  }

  ionViewWillLoad(){
    this.user = this.userProvider.userSubscribe;
    this.sync();
    this.habitos = this.habitoProvider.getHabitosObservable(this.authProvider.userUID);
  }

  sync(){
    this.userProvider.currentUserObject
      .valueChanges()
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  novoHabito(){
    this.navCtrl.push(NovoHabitoPage);
  }

  public interagir(habito: Habito){
    let status: Status = this.user.status;
    if(habito.tipo == "Desejável"){
      status.xp += 20;
      status.coins += 50;
      this.userProvider.updateStatus(status, this.authProvider.userUID)
        .then(() => {
          this.showToast("Você ganhou XP e Moedas!");
        })
        .catch(() => {
          this.showToast("Erro...");
        });
    } else {
      status.hp -= 10;
      this.userProvider.updateStatus(status, this.authProvider.userUID)
        .then(() => {
          this.showToast("Você perdeu 10 pontos de vida...");
        })
        .catch(() => {
          this.showToast("Erro...");
        });
    }
  }

}

