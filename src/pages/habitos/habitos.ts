import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  public itens: string[] = ["Estudar Matemática","Roer as Unhas","Estalar os Dedos","Procrastinar","Hábito Teste 05","Hábito Teste 06","Hábito Teste 07","Hábito Teste 08"];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HabitosPage');
  }

}

