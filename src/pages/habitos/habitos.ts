import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-habitos',
  templateUrl: 'habitos.html'
})
export class HabitosPage {
  public title: string = "Hábitos";
  constructor(public navCtrl: NavController) {

  }

}
