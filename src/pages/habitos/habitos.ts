import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user.model';
import { Status } from '../../models/status.model';

/**
 * Generated class for the HabitosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-habitos',
  templateUrl: 'habitos.html',
})
export class HabitosPage {
  public title: string = "Hábitos";
  public itens1: string[] = ["Hábito Teste 05","Hábito Teste 06","Hábito Teste 07","Hábito Teste 08"];
  public itens2: string[] = ["Dormir Tarde","Roer as Unhas","Estalar os Dedos","Procrastinar"];
  public descricao: string[] = ["descicao 1","descricao 2"];
  public user: User = new User("Fulano", "fulano", "fulano@fulano.com", "player", new Status(100, 100, 100, 10));

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HabitosPage');
  }

}

