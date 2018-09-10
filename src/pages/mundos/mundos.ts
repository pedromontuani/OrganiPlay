import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Mundo } from '../../models/mundo.model';
import { User } from '../../models/user.model';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { MundosProvider } from '../../providers/mundos/mundos';
import { NovoMundoPage } from '../novo-mundo/novo-mundo';
import { NovoMundoUsuariosPage } from '../novo-mundo-usuarios/novo-mundo-usuarios';
import { GerenciarMundoGmPage } from '../gerenciar-mundo-gm/gerenciar-mundo-gm';


@IonicPage()
@Component({
  selector: 'page-mundos',
  templateUrl: 'mundos.html',
})

export class MundosPage {

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
    public mundosProvider: MundosProvider
  ) {
  }

  ionViewWillLoad() {
    this.userUID = this.authProvider.userUID;
    if(this.userProvider.type == "gamemaster"){
      this.isGM = true;
      this.meusMundos = this.mundosProvider.getMundosGmObservable(this.userUID);
    }
    this.mundos = this.mundosProvider.getMundosObservable(this.userUID);
  }

  onClickMundo(mundo: Mundo) {

  }

  onClickMundoGM(mundo: Mundo) {
    this.navCtrl.push(
      GerenciarMundoGmPage, 
      { mundo : mundo }, 
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  addMundo() {
    this.navCtrl.push(NovoMundoUsuariosPage, {uid : this.userUID});
  }

}
