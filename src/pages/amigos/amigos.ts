import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, App } from 'ionic-angular';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AmigosProvider } from '../../providers/amigos/amigos';
import { AuthProvider } from '../../providers/auth/auth';
import { SolicitacoesAmizadeModalPage } from '../Modals/solicitacoes-amizade-modal/solicitacoes-amizade-modal';
import { UserSettings } from '../../models/user-settings.model';
import { SolicitacaoAmizade } from '../../models/solicitacao-amizade.model';


//@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {

  amigosList: Observable<string>;
  amigos: Observable<User[]>;
  userSettings: UserSettings;
  solicitacoes: SolicitacaoAmizade[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public amigosProvider: AmigosProvider,
    public authProvider: AuthProvider,
    public modalCtrl: ModalController
  ) {
    this.amigosList = this.amigosProvider.getAmigosList(this.authProvider.userUID);
    this.amigosList.subscribe(amigos => {
      this.amigos = this.amigosProvider.getPlayersObjs(amigos.split(" "));
    });
    this.amigosProvider.getPlayerSolicitacoes(this.authProvider.userUID)
      .subscribe(solicitacoes => {
        this.solicitacoes = solicitacoes;
      });
    this.userSettings = this.navParams.get('settings');
  }

  ionViewDidLoad() {
  }

  openSolicitacoesModal() {
    let theme = this.userSettings.currentTheme ? this.userSettings.currentTheme : ""
    let modalIcons = this.modalCtrl.create(
      SolicitacoesAmizadeModalPage, 

      { solicitacoes : this.amigosProvider.getPlayerSolicitacoes(this.authProvider.userUID),
        amigos : this.amigosProvider.getAmigosList(this.authProvider.userUID),
        playerUid: this.authProvider.userUID }, 

      {cssClass : `modal ${theme}`});
      
    modalIcons.present();
  }

}
