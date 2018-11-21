import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../../models/user.model';
import { UserProvider } from '../../../providers/user/user';
import { Observable } from 'rxjs/Observable';
import { AmigosProvider } from '../../../providers/amigos/amigos';
import { AuthProvider } from '../../../providers/auth/auth';
import { BasePage } from '../../base/base';
import { LojaProvider } from '../../../providers/loja/loja';
import { ItemLojaPocao } from '../../../models/item-loja-pocao.model';
import { Status } from '../../../models/status.model';


//@IonicPage()
@Component({
  selector: 'page-player-modal',
  templateUrl: 'player-modal.html',
})
export class PlayerModalPage extends BasePage {

  player: User;
  isModal: boolean = false;
  currentPlayerAmigos: string;
  pocoes: ItemLojaPocao[];
  currentPlayerPocoes: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public amigosProvider: AmigosProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public lojaProvider: LojaProvider
  ) {
    super(alertCtrl, undefined, toastCtrl);
    this.player = navParams.get('player');
    this.amigosProvider.getAmigoObj(this.player.$key).subscribe(player => {
      this.player = player;
    });
    this.isModal = navParams.get('isModal');
    this.amigosProvider.getAmigosList(this.authProvider.userUID)
      .subscribe(amigos => {
        this.currentPlayerAmigos = amigos;
      });
    this.lojaProvider.getItensLoja("Pocao")
      .first()
      .subscribe(pocoes => {
        this.pocoes = pocoes;
      });
    this.lojaProvider.getItensUsuario(this.authProvider.userUID)
      .subscribe(itens => {
        this.currentPlayerPocoes = itens.pocoes;
      });
  }

  
  getBgImgUrl(player: User) {
    if(player && player.settings && player.settings.currentWallpaper) {
      return `url(${player.settings.currentWallpaper})`;
    } else {
      return '';
    }
  }

  getNivel(xp: number): number {
    return this.userProvider.getNivel(xp);
  }

  getHPNivel(xp: number): number {
    return (this.getNivel(xp) -8) * 15 + 190;
  }

  getHPPorcentagem(xp: number, hp: number) {
    return this.userProvider.getHPPorcentagem(xp, hp);
  }

  getXPPorcentagem(xp: number) {
    return this.userProvider.getXPPorcentagem(xp);
  }

  closeModal() {
    this.navCtrl.removeView(this.navCtrl.getActive());
  }

  desfazerAmizade() {
    this.alertCtrl.create({
      title: "Desfazer amizade",
      message: `Deseja desfazer sua amizade com '${this.player.username}'?`,
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.amigosProvider.removeAmigo(
              this.authProvider.userUID,
              this.player.$key,
              this.currentPlayerAmigos,
              this.player.amigos
            ).then(() => {
              if(this.navCtrl.canGoBack()){
                this.navCtrl.pop();
              } else {
                this.navCtrl.removeView(this.navCtrl.getActive());
              }
            })
            .catch(err => {
              console.log(err);
              this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
            });
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();
  }

  reviverAmigo() {
    this.alertCtrl.create({
      title: "Reviver amigo",
      message: `Deseja reviver "${this.player.username}"?`,
      buttons: [
        {
          text: "Sim",
          handler: () => {
            if(this.canReviver()) {
              this.showPocoesDisponiveis();
            } else {
              this.showToast(`Você não possui poções de vida capazes de reviver "${this.player.username}"...`);
            }
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();
  }

  canReviver(): boolean {
    let canReviver: boolean = false;
    this.pocoes.forEach(pocao => {
      if(pocao.reviver) {
        if(this.currentPlayerPocoes && this.currentPlayerPocoes.split(" ").indexOf(pocao.$key) != -1){
          canReviver = true;
        }
      }
    });
    return canReviver;
  }

  showPocoesDisponiveis() {
    let alertPocoes = this.alertCtrl.create({
      title: "Qual poção deseja usar?",
      buttons: [
        {
          text: "Ok",
          handler: data => {
            this.pocoes.forEach(pocao => {
              if(pocao.$key == data) {
                let newAmigoStatus: Status = this.player.status;
                newAmigoStatus.hp += pocao.hp;
                this.amigosProvider.reviverAmigo(
                  this.player,
                  newAmigoStatus,
                  this.authProvider.userUID,
                  pocao,
                  this.currentPlayerPocoes
                ).then(() => {
                  this.showToast(`Parabéns! Você acabou de reviver "${this.player.username}"!`);
                })
                .catch(err => {
                  console.log(err);
                  this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
                })
              }
            })
          }
        },
        {
          text: "Cancelar"
        }
      ]
    });

    this.pocoes.forEach(pocao => {
      if(pocao.reviver) {
        if(this.currentPlayerPocoes.split(" ").indexOf(pocao.$key) != -1){
          alertPocoes.addInput({type: 'radio', label: pocao.nome, value: pocao.$key});
        }
      }
    });

    alertPocoes.present();
  }

}
