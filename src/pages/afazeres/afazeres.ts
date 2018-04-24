import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AfazeresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-afazeres',
  templateUrl: 'afazeres.html',
})
export class AfazeresPage {
  public title: string = "Afazeres";
  public itens: string[] = ["01","02","03","04","05","06","07","08","09","10"];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AfazeresPage');
  }

}
