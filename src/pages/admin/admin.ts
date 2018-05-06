import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  users: Observable<User>;
  mundos: Observable<User>;
  view: string = "users";
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public menuCtrl: MenuController
  ) {
    menuCtrl.enable(true, "menu-admin");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

}
