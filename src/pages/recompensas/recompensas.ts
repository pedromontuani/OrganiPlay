import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Status } from '../../models/status.model';
import { User } from '../../models/user.model';

/**
 * Generated class for the RecompensasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recompensas',
  templateUrl: 'recompensas.html',
})
export class RecompensasPage {
  public title: string = "Recompensas";
  public itens: String[] = ["Viajar para a Europa","Cumprir 15 Tarefas","Ter resultados na Academia","Não morrer"]
  public prices: String[] = ["1500","350","430","500"]
  public gems: String[] = ["150","35","43","50"]
  public user: User = new User("Fulano", "fulano", "fulano@fulano.com", "player", new Status(100, 100, 100, 10));
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecompensasPage');
  }

}
