import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, AlertController, ToastController } from 'ionic-angular';
import { Mundo } from '../../../models/mundo.model';
import { Observable } from 'rxjs';
import { MundosProvider } from '../../../providers/mundos/mundos';
import { User } from '../../../models/user.model';
import { AuthProvider } from '../../../providers/auth/auth';
import { NovoMundoUsuariosPage } from '../novo-mundo-usuarios/novo-mundo-usuarios';
import { BasePage } from '../../base/base';
import { NovaTarefaMundoPage } from '../nova-tarefa-mundo/nova-tarefa-mundo';
import { Afazer } from '../../../models/afazer.model';
import { GerenciarTarefaPage } from '../gerenciar-tarefa/gerenciar-tarefa';
import { NovaRecompensaMundoPage } from '../nova-recompensa-mundo/nova-recompensa-mundo';
import { RecompensaMundo } from '../../../models/recompensa-mundo.model';
import { UsuariosRecompensasPage } from '../usuarios-recompensas/usuarios-recompensas';


@IonicPage()
@Component({
  selector: 'page-gerenciar-mundo',
  templateUrl: 'gerenciar-mundo.html',
})
export class GerenciarMundoPage extends BasePage {

  mundo: Mundo;
  gmsUID: string[];
  view: string = "tarefas";
  mundoObject: Observable<Mundo>;
  playersList: Observable<User[]>;
  currentUserUID: string;
  tarefas: Observable<Afazer[]>;
  recompensasList: Observable<RecompensaMundo[]>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mundoProvider: MundosProvider,
    public authProvider: AuthProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    super(alertCtrl, undefined, toastCtrl);
    this.mundo = navParams.get("mundo");
    this.gmsUID = this.mundo.gmUID.split(" ");
    this.currentUserUID = this.authProvider.userUID;
    this.mundoObject = this.mundoProvider.getMundoObject(this.mundo.$key);
    this.mundoObject.subscribe((mundo: Mundo) => {
      this.mundo = mundo;
      this.gmsUID = this.mundo.gmUID.split(" ");
      this.playersList = this.mundoProvider.getPlayersMundo(
        mundo.players.split(" "), ""
      );
    });
    this.tarefas = this.mundoProvider.getTarefasMundo(this.mundo.$key);
    this.recompensasList = this.mundoProvider.getRecompensasMundo(this.mundo.$key);
  }


  showActionSheetPlayer(player: User) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.alertCtrl.create({
              message: "Deseja excluir este usuário?",
              buttons: [
                {
                  text: "Sim",
                  handler: () => {
                    this.mundoProvider.excluirUsuario(
                      player.$key,
                      this.mundo.$key,
                      this.mundo.players
                    ).catch(() => {
                      this.showToast("Ocorreu um erro... Tente novamente");
                    })
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

  showActionSheetTarefa(tarefa: Afazer) {

  }

  addUsuarios() {
    this.navCtrl.push(
      NovoMundoUsuariosPage,
      {
        uid: this.authProvider.userUID,
        keyMundo: this.mundo.$key,
        keysPlayers: this.mundo.players,
        isAddPlayers: true
      },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  addTarefa() {
    this.navCtrl.push(
      NovaTarefaMundoPage,
      { keyMundo: this.mundo.$key, tarefas: this.tarefas },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  addRecompensa() {
    this.navCtrl.push(
      NovaRecompensaMundoPage,
      { keyMundo: this.mundo.$key, tarefas: this.tarefas },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  onClickTarefa(tarefa: Afazer) {
    this.navCtrl.push(
      GerenciarTarefaPage,
      { tarefa: tarefa, mundo: this.mundo },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

  onClickRecompensa(recompensa: RecompensaMundo) {
    this.navCtrl.push(
      UsuariosRecompensasPage,
      { playersKeys: recompensa.portadores, recompensa: recompensa.recompensa },
      { animate: true, animation: 'slide', direction: 'forward' }
    );
  }

}
