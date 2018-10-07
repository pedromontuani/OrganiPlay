import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasePage } from '../../base/base';
import { MundosProvider } from '../../../providers/mundos/mundos';
import { AuthProvider } from '../../../providers/auth/auth';
import { IconsList } from '../../../models/icons.model';
import { User } from '../../../models/user.model';

/**
 * Generated class for the NovoMundoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public mundosProvider: MundosProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider
  ) {
    super(alertCtrl, undefined, undefined);
    this.novoMundoForm = this.formBuilder.group({
      mundo: ['', [Validators.required]],
      descricao: [],
      gmUID: [''],
      icon: ['add', [Validators.required]]
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


}
