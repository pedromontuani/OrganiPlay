import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { MundosProvider } from '../../../providers/mundos/mundos';


//@IonicPage()
@Component({
  selector: 'page-usuarios-recompensas',
  templateUrl: 'usuarios-recompensas.html',
})
export class UsuariosRecompensasPage {
  playersList: Observable<User[]>;
  playersKeys: string;
  recompensa: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public mundoProvider: MundosProvider  
  ) {
    this.recompensa = this.navParams.get("recompensa");
    this.playersKeys = this.navParams.get("playersKeys");
    if(this.playersKeys){
      this.playersList = this.mundoProvider.getPlayersByKeysArray(this.playersKeys.split(" "));
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuariosRecompensasPage');
  }

}
