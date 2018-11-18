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
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NotificationsProvider } from '../../providers/notifications/notifications';

@IonicPage()
@Component({
  selector: 'page-afazeres',
  templateUrl: 'afazeres.html',
})
export class AfazeresPage extends BasePage {
  public title: string = "Tarefas";
  public afazeres: Observable<Afazer[]>;
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
    public actionSheetCtrl: ActionSheetController,
    public localNotifications: LocalNotifications,
    public notificationsProvider: NotificationsProvider
  ) {
    super(alertCtrl, undefined, toastCtrl);
  }

  ionViewWillLoad(): void {
    this.user = this.userProvider.userSubscribe;
    this.sync();
    this.afazeres = this.afazeresProvider.getAfazeresObservable(this.authProvider.userUID);
  }

  ionViewDidLoad() {
    this.localNotifications.hasPermission()
      .then(() => {
        this.afazeres.subscribe(afazeres => {
          if(afazeres) {
            afazeres.forEach(afazer => {
              this.localNotifications.getAll()
                .then(notifications => {
                  if(notifications) {
                    console.log("Notificações", notifications);
                    notifications.forEach(notification => {
                      if((notification.title == afazer.afazer) && afazer.finalizado) {
                        console.log("Notificação cancelada", notification);
                        this.localNotifications.cancel(notification.id);
                      }
                    });
                  }
                });
            });
          }
        }); 
      });
    
  }

  sync() {
    this.userProvider.currentUserObject
      .valueChanges()
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  novoAfazer(): void {
    this.navCtrl.push(NovoAfazerPage);
  }

  finalizarTarefa(afazer: Afazer): void {
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

  validarFinalizacao(afazer: Afazer): void {
    let newStatus: Status = this.user.status;
    let originalStatus = Object.assign({}, newStatus);
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
      dateNow = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate(),23,59);
      let originalDate = new Date(Date.parse(afazer.dataFim));
      originalDate = new Date(
        originalDate.getFullYear(),
        originalDate.getMonth(),
        originalDate.getDate(),23,59);

        console.log(originalDate);
        console.log(dateNow);

      if(originalDate < dateNow) {
        newStatus.hp -= hp;
        newStatus.xp += xp/2;
        newStatus.coins += coins/2;
        penalizacao = true;
      } else {
        newStatus.xp += xp;
        newStatus.coins += coins;
        penalizacao = false;
      }
    } else {
      newStatus.xp += xp;
      newStatus.coins += coins;
      penalizacao = false;
    }

    if(newStatus.hp < 0) {
      newStatus.hp = 0;
    }

    this.userProvider.updateStatus(originalStatus, newStatus, this.authProvider.userUID)
      .then(() => {
        if(penalizacao) {
          this.showToast(`Você ganhou ${xp} XP e ${coins} moedas! Porém, perdeu ${hp} pontos de vida...`);
        } else {
          this.showToast(`Você ganhou ${xp} XP e ${coins} moedas!`);
        }
        
        this.afazeresProvider.finalizarAfazer(afazer.$key, this.authProvider.userUID)
          .catch(err => {
            console.log(err);
          }); 
      })
      .catch(err => {
        this.showToast("Erro... Tente novamente");
        console.log(err);
      });
  }

  showActionSheet(afazer: Afazer): void {
    this.actionSheetCtrl.create({
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
                    this.afazeresProvider.deletarTarefa(afazer.$key, this.authProvider.userUID)
                      .then(() => {
                        this.notificationsProvider.cancelNotificationContainingString(afazer.afazer);
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
    }).present();
  }

}
