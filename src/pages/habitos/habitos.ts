import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { Status } from '../../models/status.model';
import { UserProvider } from '../../providers/user/user';
import { NovoHabitoPage } from '../novo-habito/novo-habito';
import { Habito } from '../../models/habito.model';
import { HabitosProvider } from '../../providers/habitos/habitos';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs/Observable';
import { BasePage } from '../base/base';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NotificationsProvider } from '../../providers/notifications/notifications';

/**
 * Generated class for the HabitosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-habitos',
  templateUrl: 'habitos.html',
})
export class HabitosPage extends BasePage {
  habitos: Observable<Habito[]>;
  user: User;
  titulo: string = "Hábitos";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public userProvider: UserProvider,
    public habitoProvider: HabitosProvider,
    public authProvider: AuthProvider,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public localNotifications: LocalNotifications,
    public notificationsProvider: NotificationsProvider
  ) {
    super(alertCtrl, undefined, toastCtrl);
  }

  ionViewWillLoad() {
    this.user = this.userProvider.userSubscribe;
    this.sync();
    this.habitos = this.habitoProvider.getHabitosObservable(this.authProvider.userUID);
  }

  ionViewDidLoad() {
    this.localNotifications.hasPermission()
      .then(() => {
        this.localNotifications.getAll()
          .then(notifications => {
            console.log(notifications);
            notifications.forEach(notification => {
              if (notification && notification.text.indexOf("hábitos") > -1) {
                this.localNotifications.cancel(notification.id);
              }
            });
          })
          .catch(err => {
            console.log(err);
          });

        let availableId = 0;

        this.localNotifications.getIds()
          .then(ids => {
            if (ids.length > 0) {
              availableId = ids[ids.length - 1];
            }
          })
          .catch(err => {
            console.log(err);
          });

        this.notificationsProvider.scheduleLocalNotification(
          ++availableId,
          "Gerencie seus hábitos",
          "Você ainda não gerenciou seus hábitos hoje... Clique aqui para abrir o aplicativo e organizar suas ações do dia-a-dia!",
          new Date(new Date().getTime() + 86400000));

        this.notificationsProvider.scheduleLocalNotification(
          ++availableId,
          "Gerencie seus hábitos",
          "Você ainda não gerenciou seus hábitos essa semana... Clique aqui para abrir o aplicativo e organizar suas ações do dia-a-dia!",
          new Date(new Date().getTime() + (86400000 * 7)));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  sync() {
    this.userProvider.currentUserObject
      .valueChanges()
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  novoHabito() {
    this.navCtrl.push(NovoHabitoPage);
  }

  private bonificar(habito: Habito) {
    let newStatus: Status = this.user.status;
    let originalStatus = Object.assign({}, newStatus);
    let xp: number;
    let coins: number;

    if (habito.nivel == "Fácil") {
      newStatus.xp += 10;
      newStatus.coins += 5;
      xp = 10;
      coins = 5;
    } else if (habito.nivel == "Médio") {
      newStatus.xp += 15;
      newStatus.coins += 10;
      xp = 15;
      coins = 10;
    } else {
      newStatus.xp += 30;
      newStatus.coins += 15;
      xp = 30;
      coins = 15;
    }

    if (newStatus.hp < 0) {
      newStatus.hp = 0;
    }

    this.userProvider.updateStatus(originalStatus, newStatus, this.authProvider.userUID)
      .then(() => {
        this.showToast(`Você ganhou ${xp} XP e ${coins} moedas!`);
      })
      .catch(() => {
        this.showToast("Erro... Tente novamente");
      });
  }

  private penalizar(habito: Habito) {
    let newStatus: Status = this.user.status;
    let originalStatus = Object.assign({}, newStatus);
    let msg: number;

    if (habito.nivel == "Fácil") {
      newStatus.hp -= 5;
      msg = 5;
    } else if (habito.nivel == "Médio") {
      newStatus.hp -= 10;
      msg = 10;
    } else {
      newStatus.hp -= 15;
      msg = 15;
    }
 
    this.userProvider.updateStatus(originalStatus, newStatus, this.authProvider.userUID)
      .then(() => {
        this.showToast(`Você perdeu ${msg} pontos de vida...`);
      })
      .catch(() => {
        this.showToast("Erro... Tente novamente");
      });
  }

  showActionSheet(habito: Habito) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.alertCtrl.create({
              message: "Deseja excluir este hábito?",
              buttons: [
                {
                  text: "Sim",
                  handler: () => {
                    this.habitoProvider.deletarHabito(habito.$key, this.authProvider.userUID);
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

