import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Platform, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfazeresProvider } from '../../../providers/afazeres/afazeres';
import { AuthProvider } from '../../../providers/auth/auth';
import { BasePage } from '../../base/base';
import { Afazer } from '../../../models/afazer.model';
import { Observable } from 'rxjs/Observable';
import { MundosProvider } from '../../../providers/mundos/mundos';
import { RecompensaMundo } from '../../../models/recompensa-mundo.model';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IconsModalPage } from '../../Modals/icons-modal/icons-modal';

/**
 * Generated class for the NovaRecompensaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-nova-recompensa-mundo',
  templateUrl: 'nova-recompensa-mundo.html',
})
export class NovaRecompensaMundoPage extends BasePage {

  novaRecompensaForm: FormGroup;
  $keyMundo: string;
  $keyTarefa: string;
  edit: boolean = false;
  recompensa: RecompensaMundo;
  campoNivel: boolean = false;
  campoTarefas: boolean = false;
  campoValor: boolean = true;
  tarefas: Observable<Afazer[]>;
  imagem: string;
  icone: string = "images";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public mundosProvider: MundosProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public afazeresProvider: AfazeresProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public androidPermissions: AndroidPermissions,
    public camera: Camera,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    super(alertCtrl, loadingCtrl, undefined);
    if (this.edit) {
      this.novaRecompensaForm = this.formBuilder.group({
        recompensa: [this.recompensa.recompensa, [Validators.required]],
        descricao: [this.recompensa.descricao],
        qtd: [this.recompensa.qtd],
        nivel: [this.recompensa.nivel, [Validators.required]],
        afazer: [this.recompensa.afazer],
        moedas: [this.recompensa.moedas],
        gemas: [this.recompensa.gemas],
        dinheiro: [this.recompensa.dinheiro]
      });
      this.edit = false;
    } else {
      this.novaRecompensaForm = this.formBuilder.group({
        recompensa: ['', [Validators.required]],
        descricao: [],
        qtd: [],
        nivel: [],
        afazer: [],
        moedas: [],
        gemas: [],
        dinheiro: []
      });

    }
    this.$keyMundo = this.navParams.get("keyMundo");
    this.tarefas = this.navParams.get("tarefas");
  }


  mostrarCampos(events: any) {
    if (events.indexOf("nivel") != -1) {
      this.campoNivel = true;
    } else {
      this.campoNivel = false;
    }

    if (events.indexOf("tarefas") != -1) {
      this.campoTarefas = true;
    } else {
      this.campoTarefas = false;
    }

    if (events.indexOf("valor") != -1) {
      this.campoValor = true;
    } else {
      this.campoValor = false;
    }
  }


  showActionSheetFoto() {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Tirar foto',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.getPhotoPermission('camera');
          }
        },
        {
          text: 'Escolher da galeria',
          icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
            this.getPhotoPermission('album');
          }
        },
        {
          text: 'Usar ícone',
          icon: !this.platform.is('ios') ? 'add' : null,
          handler: () => {
            this.getIcon();
          }
        }
      ]
    }).present();
  }

  getPhotoPermission(source: string) {
    if (source == 'icon') {

    } else {
      if (this.platform.is('android')) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then(success => {
            this.tirarFoto(source);
          },
            err => {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
                .then(() => {
                  this.tirarFoto(source);
                })
                .catch(() => {
                  this.showAlert("Você deve conceder permissão ao uso da câmera");
                })
            });
      } else {
        this.tirarFoto(source);
      }
    }

  }

  tirarFoto(source: string) {
    let options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: source == 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      targetHeight: 1080,
      targetWidth: 1080
    }
    this.camera.getPicture(options).then((imageData) => {
      if(imageData){
        this.imagem = imageData;
        this.icone = null;
      }
    }, (err) => {
      console.log(err);
    }).catch((err) => {
      console.log(err);
      this.showAlert("Você deve conceder permissão ao uso da câmera");
    });
  }

  getIcon() {
    let modalIcons = this.modalCtrl.create(IconsModalPage, {}, {cssClass : 'modal'});
    modalIcons.onDidDismiss(data => {
      if(data) {
      this.icone = data.icon;
      this.imagem = null;
      } 
    });
    modalIcons.present();
  }

  onSubmit() {
    let loading = this.showLoading();
    let recompensa: RecompensaMundo = this.novaRecompensaForm.value;

    if(this.imagem) {
      let keyRecompensa: string;
      this.mundosProvider.novaRecompensa(this.$keyMundo, recompensa)
        .transaction(() => {}, (err,b,snapshot) => {
          keyRecompensa = snapshot.key;
        })
        .then(() => {
          this.mundosProvider.enviarFotoRecompensa(this.$keyMundo, keyRecompensa, this.imagem)
            .then(() => {
              loading.dismiss();
              this.navCtrl.removeView(this.navCtrl.getPrevious());
              this.navCtrl.pop();
            })
            .catch(() => {
              loading.dismiss();
              this.showToast("Ocorreu um erro... tente novamente");
            });
        })
        .catch(err => {
          loading.dismiss();
          console.log(err);
          this.showToast("Ocorreu um erro... tente novamente");
        });
    } else {
      recompensa.icon = this.icone;
      this.mundosProvider.novaRecompensa(this.$keyMundo, recompensa)
      .transaction(() => {},() => {})
      .then(() => {
        loading.dismiss();
        this.navCtrl.removeView(this.navCtrl.getPrevious());
        this.navCtrl.pop();
      })
      .catch(err => {
        loading.dismiss();
        console.log(err);
        this.showToast("Ocorreu um erro... tente novamente")
      });
    }
  }

}
