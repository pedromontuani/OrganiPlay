import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { Status } from '../../models/status.model';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user';
import { NovaRecompensaPage } from '../nova-recompensa/nova-recompensa';
import { Observable } from 'rxjs/Observable';
import { Recompensa } from '../../models/recompensa.model';
import { RecompensasProvider } from '../../providers/recompensas/recompensas';
import { AuthProvider } from '../../providers/auth/auth';
import { BasePage } from '../base/base';
import { Afazer } from '../../models/afazer.model';
import { AfazeresProvider } from '../../providers/afazeres/afazeres';

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
export class RecompensasPage extends BasePage {
  public title: string = "Recompensas";
  public recompensas: Observable<Recompensa[]>
  public user: User;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public recompensasProvider: RecompensasProvider,
    public authProvider: AuthProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public afazeresProvider: AfazeresProvider,
    public loadingCtrl: LoadingController
  ) {
    super(alertCtrl, loadingCtrl, toastCtrl);
  }

  private ionViewWillLoad(): void {
    this.user = this.userProvider.userSubscribe;
    this.sync();
    this.recompensas = this.recompensasProvider.getRecompensasObservable(this.authProvider.userUID);
  }

  private sync(): void {
    this.userProvider.currentUserObject
      .valueChanges()
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  private novaRecompensa(): void {
    this.navCtrl.push(NovaRecompensaPage);
  }

  private showRecompensa(recompensa: Recompensa): void {
    let requisitos: string = '';
    let afazer: Afazer;

    if (recompensa.moedas) {
      requisitos = requisitos += `Moedas: ${recompensa.moedas}<br>`;
    }

    if (recompensa.gemas) {
      requisitos = requisitos + `Gemas: ${recompensa.gemas}<br>`;
    }

    if (recompensa.dinheiro) {
      requisitos = requisitos += `Dinheiro: ${recompensa.dinheiro}<br>`;
    }

    if (recompensa.nivel) {
      requisitos = requisitos += `Nível: ${recompensa.nivel}<br>`;
    }

    if (recompensa.afazer) { // atraso necessário para recuperar os dados do firebase
      let loading = this.showLoading();
      this.afazeresProvider.getAfazerObservable(recompensa.afazer, this.authProvider.userUID)
        .first().subscribe((tarefa: Afazer) => {
          afazer = tarefa;
          requisitos = requisitos += `Tarefa: ${afazer.afazer}<br>`;
          this.showAlertRecompensa(recompensa, requisitos);
          loading.dismiss();
        });
    } else {
      this.showAlertRecompensa(recompensa, requisitos);
    }
  }

  private redeem(recompensa: Recompensa): void {
    let canRedeem: boolean = true;
    let status = this.user.status;
    let xpBonus: number = 50;

    if ((recompensa.moedas || recompensa.gemas) && canRedeem) {
      if (status.gems < recompensa.gemas || status.coins < recompensa.moedas) {
        canRedeem = false;
      }
    }

    if (canRedeem) {
      if (recompensa.moedas) {
        status.coins -= recompensa.moedas;
      }
      if (recompensa.gemas) {
        status.gems -= recompensa.gemas;
      }
      status.xp += xpBonus;
    }

    if (recompensa.afazer) {
      this.afazeresProvider.getAfazerObservable(recompensa.afazer, this.authProvider.userUID)
        .first().subscribe((tarefa: Afazer) => {
          if (!tarefa.finalizado) {
            canRedeem = false;
          }
          if (canRedeem) { // outro atraso necessário para recuperar os dados
            this.userProvider.updateStatus(status, this.authProvider.userUID).then(() => {
              this.recompensasProvider.excluirRecompensa(recompensa.$key, this.authProvider.userUID).then(() => {
                this.showToast(`Parabéns! Você adquiriu sua recompensa + ${xpBonus} XP!`);
              }).catch(() => {
                this.showToast("Ocorreu um erro... contate o administrador");
              })
            }).catch(() => {
              this.showToast("Ocorreu um erro... tente novamente");
            });
          } else {
            this.showToast("Você ainda não pode obter sua recompensa... verifique os requisitos");
          }

        });
    } else {
      if (canRedeem) {
        this.userProvider.updateStatus(status, this.authProvider.userUID).then(() => {
          this.recompensasProvider.excluirRecompensa(recompensa.$key, this.authProvider.userUID).then(() => {
            this.showToast(`Parabéns! Você adquiriu sua recompensa + ${xpBonus} XP!`);
          }).catch(() => {
            this.showToast("Ocorreu um erro... contate o administrador");
          })
        }).catch(() => {
          this.showToast("Ocorreu um erro... tente novamente");
        });
      } else {
        this.showToast("Você ainda não pode obter sua recompensa... verifique os requisitos");
      }
    }
  }

  private showActionSheet(recompensa: Recompensa): void {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.alertCtrl.create({
              message: "Deseja excluir esta recompensa?",
              buttons: [
                {
                  text: "Sim",
                  handler: () => {
                    this.recompensasProvider.excluirRecompensa(recompensa.$key, this.authProvider.userUID)
                      .catch(() => {
                        this.showToast("Ocorreu um erro... tente novamente");
                      });
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

  private showAlertRecompensa(recompensa: Recompensa, requisitos: string): void {
    if(recompensa.descricao){
      this.alertCtrl.create({
        title: recompensa.recompensa,
        message: `${recompensa.descricao}<br><br>Requisitos:<br>${requisitos}`,
        buttons: [
          {
            text: "Obter recompensa",
            handler: () => {
              this.redeem(recompensa);
            }
          },
          {
            text: "Cancelar"
          }
        ]
      }).present();
    } else {
      this.alertCtrl.create({
        title: recompensa.recompensa,
        message: `Requisitos:<br>${requisitos}`,
        buttons: [
          {
            text: "Obter recompensa",
            handler: () => {
              this.redeem(recompensa);
            }
          },
          {
            text: "Cancelar"
          }
        ]
      }).present();
    }
    
  }
}
