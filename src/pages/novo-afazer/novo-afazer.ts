import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Habito } from '../../models/habito.model';
import { HabitosProvider } from '../../providers/habitos/habitos';
import { AuthProvider } from '../../providers/auth/auth';
import { AfazeresProvider } from '../../providers/afazeres/afazeres';
import { Afazer } from '../../models/afazer.model';
import { IconsList } from '../../models/icons.model';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { IconsModalPage } from '../Modals/icons-modal/icons-modal';

//@IonicPage()
@Component({
  selector: 'page-novo-afazer',
  templateUrl: 'novo-afazer.html',
})
export class NovoAfazerPage extends BasePage {

  novoAfazerForm: FormGroup;
  uid: string;
  edit: boolean = false;
  afazer: Afazer;
  icons: any;
  icone: string = "images";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public afazeresProvider: AfazeresProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public notificacoesProvider: NotificationsProvider,
    public localNotifications: LocalNotifications,
    public modalCtrl: ModalController
  ) {
    super(alertCtrl, undefined, undefined);
    if (this.edit) {
      this.novoAfazerForm = this.formBuilder.group({
        afazer: [this.afazer.afazer, [Validators.required]],
        nivel: [this.afazer.nivel, [Validators.required]],
        dataFim: [this.afazer.dataFim]
      });
      this.edit = false;
    } else {
      this.novoAfazerForm = this.formBuilder.group({
        afazer: ['', [Validators.required]],
        nivel: ['Fácil', [Validators.required]],
        dataFim: []
      });
      
    }
  }

  ionViewWillLoad(){
    this.uid = this.authProvider.userUID;
    this.icons = new IconsList().returnIcons(); 
  }

  onSubmit() {
    let value = this.novoAfazerForm.value;
    let data: Date
    if(value.dataFim) {
      data = new Date(value.dataFim);
      value.dataFim = new Date(
        data.getFullYear(),
        data.getMonth(),
        data.getDate(),
        23, 59).toISOString();
    }
    value.icon = this.icone;
    console.log(value.dataFim);
    console.log(new Date(Date.now()));
    this.afazeresProvider.novoAfazer(value, this.uid)
      .then(() => {
        if(value.dataFim) {
          let notificationDate = new Date (
            data.getFullYear(),
            data.getMonth(),
            data.getDate()-1,
            8, 0);
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
          this.notificacoesProvider.scheduleLocalNotification(
            ++availableId,
            value.afazer,
            "Você já finalizou sua tarefa? O prazo para terminá-la é amanhã! Clique aqui para abrir o aplicativo e gerenciar suas tarefas.",
            notificationDate
          )
        }
        this.navCtrl.pop();
      })
      .catch((error: Error) => {
        this.showAlert(error.message);
      });
  }

  getIcon() {
    let modalIcons = this.modalCtrl.create(IconsModalPage, {}, {cssClass : 'modal'});
    modalIcons.onDidDismiss(data => {
      if(data) {
        this.icone = data.icon;
      } 
    });
    modalIcons.present();
  }

}
