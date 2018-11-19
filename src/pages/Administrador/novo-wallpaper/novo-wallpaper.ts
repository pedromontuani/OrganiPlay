import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Platform, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasePage } from '../../base/base';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LojaProvider } from '../../../providers/loja/loja';
import { ItemLojaAvatar } from '../../../models/item-loja-avatar.model';
import { ItemLojaBackground } from '../../../models/item-loja-background.model';

//@IonicPage()
@Component({
  selector: 'page-novo-wallpaper',
  templateUrl: 'novo-wallpaper.html',
})
export class NovoWallpaperPage extends BasePage {

  novoItemLojaForm: FormGroup;
  edit: boolean = false;
  itemLoja: ItemLojaBackground;
  imagem: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public androidPermissions: AndroidPermissions,
    public camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public lojaProvider: LojaProvider
  ) {
    super(alertCtrl, loadingCtrl, toastCtrl);
    if (this.edit) {
      this.novoItemLojaForm = this.formBuilder.group({
        nome: [this.itemLoja.nome],
        descricao: [this.itemLoja.descricao],
        qtd: [this.itemLoja.qtd],
        nivel: [this.itemLoja.nivel, [Validators.required]],
        moedas: [this.itemLoja.moedas],
        gemas: [this.itemLoja.gemas]
      });
      this.edit = false;
    } else {
      this.novoItemLojaForm = this.formBuilder.group({
        nome: ['', [Validators.required]],
        descricao: [],
        qtd: [],
        nivel: [],
        moedas: [],
        gemas: []
      });
    }

  }


  getPhotoPermission() {
    if (this.platform.is('android')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(success => {
          this.getFoto();
        },
          err => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
              .then(() => {
                this.getFoto();
              })
              .catch(() => {
                this.showAlert("Você deve conceder permissão ao uso da câmera");
              })
          });
    } else {
      this.getFoto();
    }
  }

  getFoto() {
    let options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      targetHeight: 1080,
      targetWidth: 1080
    }
    this.camera.getPicture(options).then((imageData) => {
      if (imageData) {
        this.imagem = imageData;
      }
    }, (err) => {
      console.log(err);
    }).catch((err) => {
      console.log(err);
      this.showAlert("Você deve conceder permissão ao uso da câmera");
    });
  }


  onSubmit() {
    let loading = this.showLoading();
    let itemLoja: ItemLojaBackground = this.novoItemLojaForm.value;

    if(!itemLoja.moedas) {
      itemLoja.moedas = 0;
    }
    
    if(!itemLoja.gemas) {
      itemLoja.gemas = 0;
    }

    if(!itemLoja.nivel) {
      itemLoja.nivel = 0;
    }

    itemLoja.ativado = true;
    itemLoja.tipo = "Wallpaper";
    this.lojaProvider.addItemLojaComFoto(itemLoja, this.imagem)
      .then(() => {
        loading.dismiss();
        this.navCtrl.pop();
      })
      .catch(err => {
        loading.dismiss();
        console.log(err);
        this.showToast("Ocorreu um erro... tente novamente");
      });
  }
}