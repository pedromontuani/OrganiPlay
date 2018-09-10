import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { MundosProvider } from '../../providers/mundos/mundos';
import { NovoMundoPage } from '../novo-mundo/novo-mundo';

@IonicPage()
@Component({
  selector: 'page-novo-mundo-usuarios',
  templateUrl: 'novo-mundo-usuarios.html',
})
export class NovoMundoUsuariosPage {

  players: Observable<User[]>;
  uid: string;
  playersSelecionados: User[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mundosProvider: MundosProvider
  ) {
  }

  ionViewWillLoad() {
    this.uid = this.navParams.get("uid");
    this.players = this.mundosProvider.getUsersList(this.uid);
  }

  onPlayerClick(player: User) {
    if (this.playersSelecionados && this.playersSelecionados.indexOf(player) == -1) {
      this.playersSelecionados.push(player);
    } else {
      this.playersSelecionados = this.playersSelecionados.filter((user: User) => user != player);
    }

  }

  filterItens(event: any) {
    let searchTerm: string = event.target.value;
    if (searchTerm) {
      /*this.players = this.players.map((users: User[]) => {
        return users.filter((user: User) => {
          return (user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        });
      });*/
    } else {
      /*this.players = this.mundosProvider.getUsersList(this.uid);*/
    }
  }

  get playersCount(): boolean {
    if (this.playersSelecionados && this.playersSelecionados.length < 1) {
      return true;
    }
    return false;
  }

  proximaPagina() {
    this.navCtrl.push(
      NovoMundoPage,
      { uid: this.uid, players: this.playersSelecionados },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

}
