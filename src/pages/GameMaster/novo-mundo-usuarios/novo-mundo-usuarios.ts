import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/user.model';
import { MundosProvider } from '../../../providers/mundos/mundos';
import { NovoMundoPage } from '../novo-mundo/novo-mundo';
import { BasePage } from '../../base/base';

@IonicPage()
@Component({
  selector: 'page-novo-mundo-usuarios',
  templateUrl: 'novo-mundo-usuarios.html',
})
export class NovoMundoUsuariosPage extends BasePage {

  players: Observable<User[]>;
  uid: string;
  playersSelecionados: User[] = [];
  $keyMundo: string;
  $keysPlayersString: string;
  isAddPlayers: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mundosProvider: MundosProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    super(alertCtrl, undefined, undefined);
    this.uid = this.navParams.get("uid");
    this.isAddPlayers = this.navParams.get("isAddPlayers");
    if (this.isAddPlayers) {
      this.$keyMundo = this.navParams.get("keyMundo");
      this.$keysPlayersString = this.navParams.get("keysPlayers");
      this.players = this.mundosProvider.addUsersList(
        this.$keysPlayersString.split(" "),
        this.uid
      );
    } else {
      this.players = this.mundosProvider.getUsersList(this.uid);
    }
    console.log(this.uid);
    console.log(this.$keyMundo);
    console.log(this.$keysPlayersString);
  }

  ionViewWillLoad() {

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

  addJogadores() {
    let playersUidsTemp: string[] = [];
    this.playersSelecionados.forEach(player => {
      playersUidsTemp.push(player.$key);
    });
    let playersKeys: string = playersUidsTemp.join(" ");
    this.mundosProvider.adicionarJogadores(
      this.$keyMundo,
      this.$keysPlayersString + " " + playersKeys
    ).then(() => {
      this.navCtrl.pop();
    }).catch(() => {
      this.showToast("Ocorreu um erro... Tente novamente");
    })
  }

}
