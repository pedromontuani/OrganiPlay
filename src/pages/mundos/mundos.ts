import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Observable } from 'rxjs';
import { Mundo } from '../../models/mundo.model';

/**
 * Generated class for the MundosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mundos',
  templateUrl: 'mundos.html',
})

export class MundosPage {

  
  mundos: Observable<Mundo[]>

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
  }

  ionViewWillLoad() {

  }

  ionViewDidLoad() {
    
  }

}
