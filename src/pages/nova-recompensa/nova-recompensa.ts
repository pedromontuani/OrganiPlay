import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Recompensa } from '../../models/recompensa.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfazeresProvider } from '../../providers/afazeres/afazeres';
import { AuthProvider } from '../../providers/auth/auth';
import { BasePage } from '../base/base';
import { RecompensasProvider } from '../../providers/recompensas/recompensas';
import { Afazer } from '../../models/afazer.model';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the NovaRecompensaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nova-recompensa',
  templateUrl: 'nova-recompensa.html',
})
export class NovaRecompensaPage extends BasePage {

  novaRecompensaForm: FormGroup;
  uid: string;
  edit: boolean = false;
  recompensa: Recompensa;
  campoNivel: boolean = false;
  campoTarefas: boolean = false;
  campoValor: boolean = true;
  tarefas: Observable<Afazer[]>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public recompensasProvider: RecompensasProvider,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public afazeresProvider: AfazeresProvider
  ) {
    super(alertCtrl, undefined, undefined);
    if (this.edit) {
      this.novaRecompensaForm = this.formBuilder.group({
        recompensa: [this.recompensa.recompensa, [Validators.required]],
        descricao: [this.recompensa.descricao],
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
        nivel: [],
        afazer: [],
        moedas: [],
        gemas: [],
        dinheiro: []
      });
      this.uid = this.authProvider.userUID;
    }
  }

  ionViewWillLoad(){
    this.tarefas = this.afazeresProvider.getAfazeresObservable(this.uid);
  }

  onSubmit() {
    this.recompensasProvider.novaRecompensa(this.novaRecompensaForm.value, this.uid)
      .then(() => {
        this.navCtrl.pop();
      })
      .catch((error: Error) => {
        this.showAlert(error.message);
      });
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
}
