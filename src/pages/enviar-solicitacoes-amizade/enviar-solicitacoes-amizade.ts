import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { AmigosProvider } from '../../providers/amigos/amigos';
import { AuthProvider } from '../../providers/auth/auth';
import { SolicitacaoAmizade } from '../../models/solicitacao-amizade.model';

//@IonicPage()
@Component({
  selector: 'page-enviar-solicitacoes-amizade',
  templateUrl: 'enviar-solicitacoes-amizade.html',
})
export class EnviarSolicitacoesAmizadePage extends BasePage{
  
  playersSelecionados: User[] = [];
  players: Observable<User[]>;;
  playerSolicitacoes: SolicitacaoAmizade[]

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public amigosProvider: AmigosProvider,
      public authProvider: AuthProvider,
      public alertCtrl: AlertController
    ) {
    super(alertCtrl, undefined, undefined);
    let currentUserAmigosList: string = this.navParams.get('amigos');

    this.players = this.amigosProvider.getPlayersParaEnviarSolicitacao(
      this.authProvider.userUID,
      currentUserAmigosList.split(" ")
    );

    this.amigosProvider.getPlayerSolicitacoes(this.authProvider.userUID)
      .subscribe(solicitacoes => {
        this.playerSolicitacoes = solicitacoes;
      });
  }


  get playersCount(): boolean {
    if (this.playersSelecionados && this.playersSelecionados.length < 1) {
      return true;
    }
    return false;
  }

  onPlayerClick(player: User) {
    if (this.playersSelecionados && this.playersSelecionados.indexOf(player) == -1) {
      this.playersSelecionados.push(player);
    } else {
      this.playersSelecionados = this.playersSelecionados.filter((user: User) => user.$key != player.$key);
    }
  }

  enviarSolicitacoes() {
    this.alertCtrl.create({
      title: "Enviar solicitações?",
      message: "Deseja enviar uma solicitação para os usuários selecionados?",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.playersSelecionados.forEach(player => {
              this.amigosProvider.sendSolicitacao(
                this.authProvider.userUID, 
                player.$key,
                this.playerSolicitacoes
              );
            });
        
            this.navCtrl.pop();
          }
        },
        {
          text: "Cancelar"
        }
      ]
    }).present();
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

}
