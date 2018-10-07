import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Mundo } from '../../models/mundo.model';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { MundosProvider } from '../../providers/mundos/mundos';
import { NovoMundoUsuariosPage } from '../GameMaster/novo-mundo-usuarios/novo-mundo-usuarios';
import { GerenciarMundoPage } from '../GameMaster/gerenciar-mundo/gerenciar-mundo';
import { AcessarMundoPage } from '../acessar-mundo/acessar-mundo';


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
    this.userUID = this.authProvider.userUID;
    if(this.userProvider.type == "gamemaster"){
      this.isGM = true;
      this.meusMundos = this.mundosProvider.getMundosGmObservable(this.userUID);
    }
    this.mundos = this.mundosProvider.getMundosObservable(this.userUID);
  }

  onClickMundo(mundo: Mundo) {
    this.navCtrl.push(
      AcessarMundoPage,
      { mundo : mundo },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  onClickMundoGM(mundo: Mundo) {
    this.navCtrl.push(
      GerenciarMundoPage, 
      { mundo : mundo }, 
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  addMundo() {
    this.navCtrl.push(NovoMundoUsuariosPage, {uid : this.userUID});
  }

}
