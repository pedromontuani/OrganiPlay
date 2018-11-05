import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { BasePage } from '../../base/base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Afazer } from '../../../models/afazer.model';

import { AuthProvider } from '../../../providers/auth/auth';
import { IconsList } from '../../../models/icons.model';
import { MundosProvider } from '../../../providers/mundos/mundos';
import { NovaRecompensaMundoPage } from '../nova-recompensa-mundo/nova-recompensa-mundo';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the NovaTarefaMundoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nova-tarefa-mundo',
  templateUrl: 'nova-tarefa-mundo.html',
})
export class NovaTarefaMundoPage extends BasePage {

  novaTarefaForm: FormGroup;
  uid: string;
  edit: boolean = false;
  afazer: Afazer;
  icons: any;
  $keyMundo: string;
  recompensa: boolean;
  comprovacao: boolean = false;
  tarefas: Observable<Afazer[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public mundoProvider: MundosProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public toastCtrl: ToastController
  ) {
    super(alertCtrl, undefined, toastCtrl);
    if (this.edit) {
      this.novaTarefaForm = this.formBuilder.group({
        afazer: [this.afazer.afazer, [Validators.required]],
        descricao: [this.afazer.descricao],
        icon: [this.afazer.icon, [Validators.required]],
        nivel: [this.afazer.nivel, [Validators.required]],
        dataFim: [this.afazer.dataFim]
      });
      this.edit = false;
    } else {
      this.novaTarefaForm = this.formBuilder.group({
        afazer: ['', [Validators.required]],
        descricao: [],
        icon: ['add', [Validators.required]],
        nivel: ['Fácil', [Validators.required]],
        dataFim: []
      });
      this.$keyMundo = this.navParams.get("keyMundo");
    }
  }

  ionViewWillLoad(){
    this.uid = this.authProvider.userUID;
    this.icons = new IconsList().returnIcons();
  }

  onSubmit() {
    this.novaTarefaForm.value.comprovacao = this.comprovacao;
    this.mundoProvider.novaTarefa(this.$keyMundo, this.novaTarefaForm.value)
      .then(() => {
        this.navCtrl.pop();
      }).catch(() => {
        this.showToast("Ocorreu um erro... Tente novamente");
      });
  }

  novaTarefa() {
    document.getElementById("submitBtn").click();
  }

}
