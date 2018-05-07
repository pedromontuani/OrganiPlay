import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user';
import { AdminProvider } from '../../providers/admin/admin';

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
  users: Observable<User[]>;
  mundos: Observable<User>;
  view: string = "users";
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public menuCtrl: MenuController,
    public userProvider: UserProvider,
    public adminProvider: AdminProvider
  ) {
    menuCtrl.enable(true, "menu-admin");
  }

  ionViewCanEnter(): boolean {
    return this.userProvider.type == "adm";
  }

  ionViewWillLoad(){
    this.users = this.adminProvider.users;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  onUserClick(){
    console.log('ionViewDidLoad AdminPage');
  }

  addUsuario(){
    console.log("Usuario");
  }

  addMundo(){
    console.log("Mundo");
  }

}
