import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SingleSolicitacaoAmizadeModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-single-solicitacao-amizade-modal',
  templateUrl: 'single-solicitacao-amizade-modal.html',
})
export class SingleSolicitacaoAmizadeModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleSolicitacaoAmizadeModalPage');
  }

}
