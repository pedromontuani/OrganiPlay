import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Mundo } from '../../models/mundo.model';


@IonicPage()
@Component({
  selector: 'page-gerenciar-mundo-gm',
  templateUrl: 'gerenciar-mundo-gm.html',
})
export class GerenciarMundoGmPage {

  public mundo: Mundo;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.mundo = navParams.get("mundo");  
  }

  ionViewDidLoad() {
    
  }

}
