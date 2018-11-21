import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, AlertController } from 'ionic-angular';
import { SolicitacaoAmizade } from '../../../models/solicitacao-amizade.model';
import { User } from '../../../models/user.model';
import { AmigosProvider } from '../../../providers/amigos/amigos';
import { Observable } from 'rxjs/Observable';
import { BasePage } from '../../base/base';
import { LojaPage } from '../../loja/loja';
import { PhotoViewer } from '@ionic-native/photo-viewer';


//@IonicPage()
@Component({
  selector: 'page-solicitacoes-amizade-modal',
  templateUrl: 'solicitacoes-amizade-modal.html',
})
export class SolicitacoesAmizadeModalPage extends BasePage {

  players: Observable<User[]>;
  amigosList: string;
  playerUid: string;
  solicitacoes: Observable<SolicitacaoAmizade[]>;
  theme: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public amigosProvider: AmigosProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public photoViewer: PhotoViewer
  ) {

    super(undefined, undefined, toastCtrl);

    this.solicitacoes = this.navParams.get('solicitacoes');

    this.theme = this.navParams.get('theme');

    let amigosList: Observable<string> = this.navParams.get('amigos');
    amigosList.subscribe(amigos => {
      this.amigosList = amigos;
    });

    this.playerUid = this.navParams.get('playerUid');

    this.solicitacoes.subscribe(solicitacoes => {
      let uids: string[] = [];
      solicitacoes.forEach(solicitacao => {
        uids.push(solicitacao.senderUid);
      });
      this.players = this.amigosProvider.getPlayersObjs(uids);
    });

  }

  closeModal() {
    this.navCtrl.removeView(this.navCtrl.getActive());
  }

  showModalPlayer(player: User) {

  }

  aceitarSolicitacao(player: User) {
    let solicitacaoKey: string;

    this.solicitacoes.first().subscribe(solicitacoes => {
      solicitacoes.forEach(solicitacao => {
        console.log("Solicitacoes", solicitacao);
        if (solicitacao.senderUid == player.$key) {
          solicitacaoKey = solicitacao.$key;
        }

        this.amigosProvider
          .aceitarSolicitacao(
            solicitacaoKey,
            player.$key,
            this.playerUid,
            player.amigos ? player.amigos : "",
            this.amigosList ? this.amigosList : ""
          )
          .then(() => {
            this.showToast(`Você adicionou '${player.username}' à sua lista de amigos`);
          })
          .catch(err => {
            console.log(err);
            this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
          });
      });
    });
  }

  rejeitarSolicitacao(player: User) {
    this.alertCtrl.create({
      message: "Deseja excluir esta solicitação?",
      buttons: [
        {
          text: "Sim",
          handler: () => { 
            let solicitacaoKey: string;

            this.solicitacoes.first().subscribe(solicitacoes => {
              solicitacoes.forEach(solicitacao => {
                console.log("Solicitacoes", solicitacao);
                if (solicitacao.senderUid == player.$key) {
                  solicitacaoKey = solicitacao.$key;
                }
              });


              this.amigosProvider.deleteSolicitacao(
                this.playerUid,
                solicitacaoKey
              ).catch(err => {
                console.log(err);
                this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
              });
            });
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();
  }


  onClickAvatar(player: User) {
    if(player.settings.currentAvatar) {
      this.photoViewer.show(player.settings.currentAvatar);
    }
  }
}

