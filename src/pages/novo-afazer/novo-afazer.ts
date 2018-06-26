import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Habito } from '../../models/habito.model';
import { HabitosProvider } from '../../providers/habitos/habitos';
import { AuthProvider } from '../../providers/auth/auth';
import { AfazeresProvider } from '../../providers/afazeres/afazeres';
import { Afazer } from '../../models/afazer.model';

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
        descricao: [this.afazer.descricao],
        nivel: [this.afazer.nivel, [Validators.required]],
        dataFim: [this.afazer.dataFim],
        recompensa: [this.afazer.recompensa]
      });
      this.edit = false;
    } else {
      this.novoAfazerForm = this.formBuilder.group({
        afazer: ['', [Validators.required]],
        descricao: [],
        nivel: ['Fácil', [Validators.required]],
        dataFim: [],
        recompensa: []
      });
      this.uid = this.authProvider.userUID;
    }
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
