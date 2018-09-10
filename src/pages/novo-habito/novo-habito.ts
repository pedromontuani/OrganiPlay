import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HabitosProvider } from '../../providers/habitos/habitos';
import { BasePage } from '../base/base';
import { AuthProvider } from '../../providers/auth/auth';
import { Habito } from '../../models/habito.model';

/**
 * Generated class for the NovoHabitoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-novo-habito',
  templateUrl: 'novo-habito.html',
})
export class NovoHabitoPage extends BasePage {
  novoHabitoForm: FormGroup;
  uid: string;
  edit: boolean = false;
  habito: Habito;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public habitosProvider: HabitosProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider
  ) {
    super(alertCtrl, undefined, undefined);
    if (this.edit) {
      this.novoHabitoForm = this.formBuilder.group({
        habito: [this.habito.habito, [Validators.required]],
        descricao: [this.habito.descricao],
        tipo: [this.habito.tipo, [Validators.required]],
        nivel: [this.habito.nivel, [Validators.required]]
      });
      this.edit = false;
    } else {
      this.novoHabitoForm = this.formBuilder.group({
        habito: ['', [Validators.required]],
        descricao: [],
        tipo: ['Desejável', [Validators.required]],
        nivel: ['Fácil', [Validators.required]]
      }); 
    }
  }

  ionViewWillLoad() {
    this.uid = this.authProvider.userUID;
  }

  onSubmit() {
    this.habitosProvider.novoHabito(this.novoHabitoForm.value, this.uid)
      .then(() => {
        this.navCtrl.pop();
      })
      .catch((error: Error) => {
        this.showAlert(error.message);
      });
  }


}
