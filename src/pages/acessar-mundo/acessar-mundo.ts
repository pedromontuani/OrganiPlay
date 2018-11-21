import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Mundo } from '../../models/mundo.model';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { Afazer } from '../../models/afazer.model';
import { MundosProvider } from '../../providers/mundos/mundos';
import { AuthProvider } from '../../providers/auth/auth';
import { BasePage } from '../base/base';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RecompensaMundo } from '../../models/recompensa-mundo.model';
import { Status } from '../../models/status.model';
import { UserProvider } from '../../providers/user/user';


//@IonicPage()
@Component({
  selector: 'page-acessar-mundo',
  templateUrl: 'acessar-mundo.html',
})
export class AcessarMundoPage extends BasePage {

  mundo: Mundo;
  view: string = "tarefas";
  mundoObject: Observable<Mundo>;
  playersList: Observable<User[]>;
  currentUserUID: string;
  currentUser: User;
  tarefas: Observable<Afazer[]>;
  recompensasList: Observable<RecompensaMundo[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mundoProvider: MundosProvider,
    public authProvider: AuthProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider,
    public androidPermissions: AndroidPermissions
  ) {
    super(alertCtrl, loadingCtrl, toastCtrl);
    this.mundo = navParams.get("mundo");
    this.currentUserUID = this.authProvider.userUID;
    this.userProvider.currentUserObject.valueChanges().subscribe(user => {
      this.currentUser = user;
    });
    this.mundoObject = this.mundoProvider.getMundoObject(this.mundo.$key);
    this.mundoObject.subscribe((mundo: Mundo) => {
      this.mundo = mundo;
      this.playersList = this.mundoProvider.getPlayersMundo(
        mundo.players.split(" ").filter(value => { return value != " " }),
        this.currentUserUID
      );
    });
    this.tarefas = this.mundoProvider.getTarefasMundo(this.mundo.$key);
    this.recompensasList = this.mundoProvider.getRecompensasMundo(this.mundo.$key);
  }

  onClickTarefa(tarefa: Afazer) {
    if (!this.isSubmetida(tarefa)) {
      if (tarefa.comprovacao) {
        this.alertCtrl.create({
          message: "Esta tarefa necessita de comprovação. Deseja enviar?",
          buttons: [
            {
              text: "Sim",
              handler: () => {
                this.showActionSheetComprovacao(tarefa);
              }
            },
            {
              text: "Não"
            }
          ]
        }).present();
      } else {
        this.alertCtrl.create({
          message: "Deseja finalizar esta tarefa?",
          buttons: [
            {
              text: "Sim",
              handler: () => {
                this.finalizarTarefa(tarefa, "");
              }
            },
            {
              text: "Não"
            }
          ]
        }).present();
      }
    } else {
      this.showToast("Sua submissão está sendo analizada");
    }
  }

  finalizarTarefa(tarefa: Afazer, photoUrl: string) {
    let date = new Date(Date.now());;
    let submissao: any;
    if (photoUrl != "") {
      submissao = {
        timestamp: date.getTime(),
        photoUrl: photoUrl,
        verificado: false
      };
    } else {
      submissao = {
        timestamp: date.getTime(),
        verificado: false
      };
    }

    this.mundoProvider.finalizarTarefa(
      tarefa.$key,
      this.mundo.$key,
      this.currentUserUID,
      submissao
    ).then(() => {
      this.showToast("Sua submissão está sendo analizada");
    })
      .catch((err) => {
        console.log(err);
        this.showToast("Ocorreu um erro... tente novamente.");
      });
  }

  enviarComprovacao(tarefa: Afazer, source: string) {
    if (this.platform.is('android')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(success => {
          this.tirarFoto(tarefa, source);
        },
          err => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
              .then(() => {
                this.enviarComprovacao(tarefa, source);
              })
              .catch(() => {
                this.showAlert("Você deve conceder permissão ao uso da câmera");
              })
          });
    } else {
      this.tirarFoto(tarefa, source);
    }

  }

  tirarFoto(tarefa: Afazer, source: string) {
    let loading = this.showLoading();
    let options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: source == 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      targetHeight: 1920,
      targetWidth: 1080
    }
    this.camera.getPicture(options).then((imageData) => {
      let base64: string = imageData;
      let uploadTask = this.mundoProvider.enviarComprovacao(
        tarefa.$key,
        this.mundo.$key,
        base64,
        this.currentUserUID
      );
      uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
      }, (error: Error) => {
        console.log(error);
        loading.dismiss();
        this.showToast("Ocorreu um erro... tente novamente");
      }, () => {
        let photoUrl: string = uploadTask.snapshot.downloadURL;
        loading.dismiss();
        this.finalizarTarefa(tarefa, photoUrl);
      });
    }, (err) => {
      console.log(err);
      loading.dismiss();
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
      this.showAlert("Você deve conceder permissão ao uso da câmera");
    });
  }

  isSubmetida(tarefa: Afazer) {
    if (tarefa.submissoes) {
      return Object.keys(tarefa.submissoes).indexOf(this.currentUserUID) != -1;
    }
  }

  isComprovada(tarefa: Afazer) {
    if (this.isSubmetida(tarefa)) {
      return tarefa.submissoes[this.currentUserUID].verificado;
    }
  }

  showActionSheetComprovacao(tarefa: Afazer) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Tirar foto',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.enviarComprovacao(tarefa, 'camera');
          }
        },
        {
          text: 'Escolher da galeria',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
            this.enviarComprovacao(tarefa, 'album');
          }
        }
      ]
    }).present();
  }

  showAlertRecompensa(recompensa: RecompensaMundo) {
    let requisitos: string = "";
    let mensagem: string = "";
    let tarefas: Afazer[];
    this.tarefas.first().subscribe(data => {
      tarefas = data;
    });
    if (recompensa.moedas) {
      requisitos += `Moedas: ${recompensa.moedas}<br>`;
    }
    if (recompensa.gemas) {
      requisitos += `Gemas: ${recompensa.gemas}<br>`;
    }
    if (recompensa.nivel) {
      requisitos += `Nível: ${recompensa.nivel}<br>`;
    }
    if (recompensa.dinheiro) {
      requisitos += `Dinheiro: R$ ${recompensa.dinheiro}<br>`;
    }
    if (recompensa.afazer) {
      this.tarefas.first().subscribe(afazer => {
        afazer.forEach(afazer => {
          if (afazer.$key == recompensa.afazer) {
            requisitos += `Tarefa: ${afazer.afazer}<br>`;
          }
        });
      });
    }

    if (recompensa.descricao) {
      mensagem = recompensa.descricao + "<br><br>";
    }

    mensagem += `Requisitos:<br>${requisitos}`;

    this.alertCtrl.create({
      title: "Obter recompensa?",
      message: `<b>${recompensa.recompensa}</b><br>${mensagem}`,
      buttons: [
        {
          text: "Obter",
          handler: () => {
            this.redeemRecompensa(recompensa, tarefas);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    }).present();
  }

  redeemRecompensa(recompensa: RecompensaMundo, tarefas: Afazer[]) {
    let loading = this.showLoading();
    let canRedeem: boolean = true;
    let newUserStatus: Status = this.currentUser.status;
    let originalStatus = Object.assign({}, newUserStatus);

    if (recompensa.moedas) {
      if (newUserStatus.coins >= recompensa.moedas) {
        newUserStatus.coins -= recompensa.moedas
      } else {
        canRedeem = false;
      }
    }

    if (recompensa.gemas) {
      if (newUserStatus.gems >= recompensa.gemas) {
        newUserStatus.gems -= recompensa.gemas
      } else {
        canRedeem = false;
      }
    }

    if (recompensa.afazer) {

      tarefas.forEach(tarefa => {
        if (recompensa.afazer == tarefa.$key) {
          if (!this.isComprovada(tarefa)) {
            canRedeem = false;
          }
        }
      });

    }

    if(recompensa.nivel) {
      if(recompensa.nivel > this.userProvider.getNivel(this.currentUser.status.xp)) {
        canRedeem = false;
      }
    }

    if (canRedeem) {
      let portadores: string;
      if (recompensa.portadores) {
        let usersUID: string[] = recompensa.portadores.split(" ").filter(value => { return value != " " });
        usersUID.push(this.currentUserUID);
        portadores = usersUID.join(" ");
      } else {
        portadores = this.currentUserUID
      }
      this.mundoProvider.updateRecompensaMundo(
        this.mundo.$key,
        recompensa.$key,
        { portadores: portadores })
        .then(() => {
          newUserStatus.xp += 50;
          this.userProvider.updateStatus(originalStatus, newUserStatus, this.currentUserUID)
            .then(() => {
              this.showToast("Parabéns! Você obteve sua recompensa e um bônus de 50XP!");
            })
            .catch(err => {
              console.log(err);
              this.showToast("Ocorreu um erro... contate um administrador");
            });
        })
        .catch(err => {
          console.log(err);
          this.showToast("Ocorreu um erro... tente novamete");
        });
    } else {
      this.showToast("Você ainda não pode obter esta recompensa... verifique os requisitos");
    }
    loading.dismiss();
  }

  isPortador(recompensa: RecompensaMundo): boolean {
    if (recompensa.portadores) {
      return recompensa.portadores
        .split(" ").filter(value => { return value != " " })
        .indexOf(this.currentUserUID) != -1;
    } else {
      return false;
    }
  }


}
