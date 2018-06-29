import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ActionSheetController, Platform } from 'ionic-angular';
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
  public title: string = "Tarefas";
  public afazeres: Observable<Afazer[]>
  public user: User;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public authProvider: AuthProvider,
    public afazeresProvider: AfazeresProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController
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
    if (!afazer.finalizado) {
      this.alertCtrl.create({
        message: "Deseja finalizar esta tarefa?",
        buttons: [
          {
            text: "Sim",
            handler: () => {
              this.validarFinalizacao(afazer);
            }
          },
          {
            text: "Não"
          }
        ]
      }).present();
    }
  }

  validarFinalizacao(afazer: Afazer) {
    let status: Status = this.user.status;
    let xp: number;
    let coins: number;
    let hp;
    let penalizacao: boolean;
    if (afazer.nivel == "Fácil") {
      xp = 20;
      coins = 10;
      hp = 10;
    } else if (afazer.nivel == "Médio") {
      xp = 30;
      coins = 20;
      hp = 15;
    } else {
      xp = 50;
      coins = 40;
      hp = 20;
    }

    if(afazer.dataFim) {
      let dateNow = new Date(Date.now());
      let originalDate = new Date(afazer.dataFim);
      if(originalDate.getDate()+1 < dateNow.getDate()) {
        status.hp -= hp;
        status.xp += xp/2;
        status.coins += coins/2;
        penalizacao = true;
      }
    }

    if(status.hp < 0) {
      status.hp = 0;
    }

    this.userProvider.updateStatus(status, this.authProvider.userUID)
      .then(() => {
        if(penalizacao) {
          this.showToast(`Você ganhou ${xp} XP e ${coins} moedas! Porém, perdeu ${hp} pontos de vida...`);
        } else {
          this.showToast(`Você ganhou ${xp} XP e ${coins} moedas!`);
        }
      })
      .catch(() => {
        this.showToast("Erro... Tente novamente");
      });

    this.afazeresProvider.finalizarAfazer(afazer.$key, this.authProvider.userUID);
  }

  showActionSheet(afazer: Afazer) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.alertCtrl.create({
              message: "Deseja excluir esta tarefa?",
              buttons: [
                {
                  text: "Sim",
                  handler: () => {
                    this.afazeresProvider.deletarTarefa(afazer.$key, this.authProvider.userUID);
                  }
                },
                {
                  text: "Não"
                }
              ]
            }).present();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            
          }
        }
      ]
    });
 
    actionSheet.present();
  }

}
