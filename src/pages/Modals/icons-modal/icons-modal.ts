import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { IconsList } from '../../../models/icons.model';

@Component({
  selector: 'page-icons-modal',
  templateUrl: 'icons-modal.html',
})
export class IconsModalPage {
  icons: string[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    let iconsList = new IconsList();
    this.icons = iconsList.returnIcons();
  }

  getIcon(icon: string) {
    this.viewCtrl.dismiss({icon: icon});
  }

}
