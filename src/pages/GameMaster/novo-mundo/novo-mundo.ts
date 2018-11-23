import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasePage } from '../../base/base';
import { MundosProvider } from '../../../providers/mundos/mundos';
import { AuthProvider } from '../../../providers/auth/auth';
import { IconsList } from '../../../models/icons.model';
import { User } from '../../../models/user.model';
import { IconsModalPage } from '../../Modals/icons-modal/icons-modal';

/**
 * Generated class for the NovoMundoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-novo-mundo',
  templateUrl: 'novo-mundo.html',
})
export class NovoMundoPage extends BasePage{
  novoMundoForm: FormGroup;
  uid: string;
  icons: any;
  players: User[];
  playersUidString: string = "";
  icone: string = "images";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public mundosProvider: MundosProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public modalCtrl: ModalController
  ) {
    super(alertCtrl, undefined, undefined);
    this.novoMundoForm = this.formBuilder.group({
      mundo: ['', [Validators.required]],
      descricao: [],
      gmUID: ['']
    });
  }

  ionViewWillLoad(){
    this.uid = this.navParams.get("uid");
    this.players = this.navParams.get("players");
    this.icons = new IconsList().returnIcons(); 
    let playersUidsTemp: string[] = [];
    this.players.forEach(player => {
      playersUidsTemp.push(player.$key);
    });
    this.playersUidString = playersUidsTemp.join(" ");
  }

  onSubmit() {
    let valores = this.novoMundoForm.value;
    valores.gmUID = this.uid;
    valores.players = this.playersUidString;
    valores.icon = this.icone;
    this.mundosProvider.novoMundo(this.novoMundoForm.value)
      .then(() => {
        this.navCtrl.removeView(this.navCtrl.getPrevious());
        this.navCtrl.pop();
      })
      .catch((error: Error) => {
        this.showAlert(error.message);
      });
  }

  clickSubmit() {
    document.getElementById("submitBtn").click();
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
