import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Status } from '../../models/status.model';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user';
import { NovaRecompensaPage } from '../nova-recompensa/nova-recompensa';
import { Observable } from 'rxjs/Observable';
import { Recompensa } from '../../models/recompensa.model';
import { RecompensasProvider } from '../../providers/recompensas/recompensas';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RecompensasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recompensas',
  templateUrl: 'recompensas.html',
})
export class RecompensasPage {
  public title: string = "Recompensas";
  public recompensas: Observable<Recompensa[]>
  public user: User;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public recompensasProvider: RecompensasProvider,
    public authProvider: AuthProvider
  ) {
  }

  ionViewWillLoad() {
    this.user = this.userProvider.userSubscribe;
    this.sync();
    this.recompensas = this.recompensasProvider.getRecompensasObservable(this.authProvider.userUID);
  }

  sync() {
    this.userProvider.currentUserObject
      .valueChanges()
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  novaRecompensa() {
    this.navCtrl.push(NovaRecompensaPage);
  }
}
