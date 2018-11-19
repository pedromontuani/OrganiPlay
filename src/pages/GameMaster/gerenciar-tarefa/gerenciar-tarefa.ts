import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../../models/user.model';
import { Afazer } from '../../../models/afazer.model';
import { Observable } from 'rxjs';
import { SubmissaoTarefa } from '../../../models/submissao-tarefa.model';
import { MundosProvider } from '../../../providers/mundos/mundos';
import { Mundo } from '../../../models/mundo.model';
import { UserProvider } from '../../../providers/user/user';
import { AdminProvider } from '../../../providers/admin/admin';
import { Status } from '../../../models/status.model';
import { BasePage } from '../../base/base';
import { PhotoViewer } from '@ionic-native/photo-viewer';

//@IonicPage()
@Component({
  selector: 'page-gerenciar-tarefa',
  templateUrl: 'gerenciar-tarefa.html',
})
export class GerenciarTarefaPage extends BasePage {
  playersList: Observable<User[]>;
  tarefa: Afazer;
  submissoesTarefa: Observable<SubmissaoTarefa[]>;
  mundo: Mundo;
  submissoesTarefaVec: SubmissaoTarefa[] = [];
  view: string = "pendentes";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mundoProvider: MundosProvider,
    public userProvider: UserProvider,
    public admProvider: AdminProvider,
    public alertCtrl: AlertController,
    private photoViewer: PhotoViewer,
    public toastCtrl: ToastController
  ) {
    super(alertCtrl, undefined, toastCtrl);
    this.tarefa = this.navParams.get('tarefa');
    this.mundo = this.navParams.get('mundo');
    this.submissoesTarefa = this.mundoProvider.getSubmissoesTarefas(this.tarefa.$key, this.mundo.$key);
    this.submissoesTarefa.first().subscribe((submissoes) => {
      let $keys: string[] = [];
      submissoes.forEach(element => {
        $keys.push(element.$key);
      });
      this.playersList = this.mundoProvider.getPlayersByKeysArray($keys);
    });
    this.submissoesTarefa.subscribe((submissoes) => {
      this.submissoesTarefaVec = submissoes;
    })
  }

  getPhotoSrc(player: User): string {
    let url: string;
    this.submissoesTarefaVec.forEach(element => {
      if (player.$key == element.$key) {
        url = element.photoUrl;
      }
    });
    return url;
  }

  aprovar(player: User) {
    this.alertCtrl.create({
      message: "Deseja aprovar esta tarefa?",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.atualizarStatus(player);
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();
  }

  reprovar(player: User) {
    this.alertCtrl.create({
      message: "Deseja reprovar esta tarefa?",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.mundoProvider.deleteComprovacao(
              this.tarefa.$key,
              this.mundo.$key,
              player.$key
            )
              .then(() => {
                document.getElementById(player.$key).style.display = "none";
              })
              .catch((err) => {
                console.log(err);
                this.showToast("Ocorreu um erro... tente novamene");
              });
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();
  }

  comprovado(player: User): boolean {
    let estado: boolean;
    this.submissoesTarefaVec.forEach(element => {
      if (player.$key == element.$key) {
        estado = element.verificado;
      }
    });
    return estado;
  }

  pickImage(player: User) {
    this.photoViewer.show(this.getPhotoSrc(player));
  }

  atualizarStatus(player: User) {
    let newStatus: Status = player.status;
    let originalStatus = Object.assign({}, newStatus);
    let peso: number;
    let moedas: number = 20;
    let xp: number = 10;
    if (this.tarefa.nivel == "Fácil") {
      peso = 1;
    } else if (this.tarefa.nivel == "Médio") {
      peso = 2;
    } else {
      peso = 3;
    }

    newStatus.coins = moedas * peso;
    newStatus.xp *= peso;
    newStatus.gems += peso - 1;

    this.mundoProvider.updateComprovacao(
      this.tarefa.$key,
      this.mundo.$key,
      player.$key,
      { verificado: true }
    ).then(() => {
      this.userProvider.updateStatus(originalStatus, newStatus, player.$key);
      document.getElementById(player.$key).style.display = "none";
    })
      .catch((err) => {
        console.log(err);
      });
  }

}
