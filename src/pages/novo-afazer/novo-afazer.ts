import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Habito } from '../../models/habito.model';
import { HabitosProvider } from '../../providers/habitos/habitos';
import { AuthProvider } from '../../providers/auth/auth';
import { AfazeresProvider } from '../../providers/afazeres/afazeres';
import { Afazer } from '../../models/afazer.model';
import { IconsList } from '../../models/icons.model';

@IonicPage()
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public afazeresProvider: AfazeresProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider
  ) {
    super(alertCtrl, undefined, undefined);
    if (this.edit) {
      this.novoAfazerForm = this.formBuilder.group({
        afazer: [this.afazer.afazer, [Validators.required]],
        icon: [this.afazer.icon, [Validators.required]],
        nivel: [this.afazer.nivel, [Validators.required]],
        dataFim: [this.afazer.dataFim]
      });
      this.edit = false;
    } else {
      this.novoAfazerForm = this.formBuilder.group({
        afazer: ['', [Validators.required]],
        icon: ['add', [Validators.required]],
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
    this.afazeresProvider.novoAfazer(this.novoAfazerForm.value, this.uid)
      .then(() => {
        this.navCtrl.pop();
      })
      .catch((error: Error) => {
        this.showAlert(error.message);
      });
  }

}
