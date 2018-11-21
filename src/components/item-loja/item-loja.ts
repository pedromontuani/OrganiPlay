import { Component, Input } from '@angular/core';
import { ItemLojaAvatar } from '../../models/item-loja-avatar.model';
import { ItemLojaPocao } from '../../models/item-loja-pocao.model';
import { LojaProvider } from '../../providers/loja/loja';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AuthProvider } from '../../providers/auth/auth';
import { BasePage } from '../../pages/base/base';
import { Status } from '../../models/status.model';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ItensLojaUsuarios } from '../../models/itens-loja-usuarios.model';

/**
 * Generated class for the ItemLojaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-loja',
  templateUrl: 'item-loja.html'
})



export class ItemLojaComponent extends BasePage {

  @Input() itemLoja: any;
  @Input() isComprado: boolean;
  @Input() isUsando: boolean = false;
  @Input() itensUsuario: ItensLojaUsuarios;
  @Input() userStatus: Status;

  constructor(
    public lojaProvider: LojaProvider,
    public userProvider: UserProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public photoViewer: PhotoViewer
  ) {
    super(alertCtrl, loadingCtrl, toastCtrl);
  }

  onClickImage(imgURL: string) {
    this.photoViewer.show(imgURL);
  }

  onClickComprar() {
    this.alertCtrl.create({
      message: "Deseja comprar este item?",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.comprar(this.itemLoja);
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();
  }

  comprar(item: any) {
    let loading = this.showLoading();
    let uid = this.authProvider.userUID;
    this.userProvider.getUserStatus(uid)
      .first()
      .subscribe(status => {
        if (
          status.coins >= item.moedas
          && status.gems >= item.gemas
          && this.userProvider.getNivel(status.xp) >= item.nivel
        ) {
          let newStatus = new Status(
            status.xp,
            status.hp,
            status.coins -= item.moedas,
            status.gems -= item.gemas
          );
          this.lojaProvider.comprarItem(item, newStatus, uid)
            .then(() => {
              loading.dismiss();
              this.showToast("Parabéns, você adquiriu um novo item!");
            })
            .catch(err => {
              console.log(err);
              loading.dismiss();
              this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
            })
        } else {
          loading.dismiss();
          this.showToast("Você não pode comprar esse item ainda... Verifique os requisitos");
        }
      })
  }

  onClickUsar() {
    this.alertCtrl.create({
      message: "Deseja usar este item?",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.usar(this.itemLoja);
          }
        },
        {
          text: "Não"
        }
      ]
    }).present();
  }

  usar(item: any) {
    let loading = this.showLoading();
    let uid = this.authProvider.userUID;
    if (item.tipo == "Pocao") {
      let originalStatus = this.userStatus;
      if (originalStatus) {
        let newStatus = Object.assign({}, originalStatus);
        console.log(newStatus.hp + item.hp);
        if ((newStatus.hp + item.hp) > this.userProvider.getHPNivel(originalStatus.xp)) {
          
          newStatus.hp = this.userProvider.getHPNivel(originalStatus.xp)
        } else {
          newStatus.hp += item.hp;
        }
        this.userProvider.updateStatus(originalStatus, newStatus, uid)
          .then(() => {
            let pocoes: string[] = [];
            this.itensUsuario.pocoes.split(" ").filter(value => {return value != " "}).forEach(pocao => {
              if (pocao != item.$key) {
                pocoes.push(pocao);
              }
            })
            this.lojaProvider.usarItem(item, uid, pocoes.join(" "))
              .then(() => {
                loading.dismiss();
                this.showToast(`Você acabou de usar seu item "${item.nome}"`);
              })
              .catch(err => {
                console.log(err);
                loading.dismiss();
                this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
              });
          })
          .catch(err => {
            console.log(err);
            loading.dismiss();
            this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
          });
      } else {
        loading.dismiss();
        this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
      }

    } else {
      this.lojaProvider.usarItem(item, uid, undefined)
        .then(() => {
          loading.dismiss();
          this.showToast(`Você acabou de usar seu item "${item.nome}"`);
        })
        .catch(err => {
          console.log(err);
          this.showToast("Ocorreu um erro... tente novamente ou contacte um administrador");
        });
    }

  }
}
