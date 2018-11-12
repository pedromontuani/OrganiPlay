import { Component, Input } from '@angular/core';
import { User } from './../../models/user.model';
import { ItensLojaUsuarios } from '../../models/itens-loja-usuarios.model';
import { UserProvider } from '../../providers/user/user';
import { LojaProvider } from '../../providers/loja/loja';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent {

  @Input() isMenu: boolean = false;
  @Input() user: User;

  constructor(public userProvider: UserProvider, public lojaProvider: LojaProvider) {
    console.log('Hello UserInfoComponent Component');
  }

  getBgImgUrl(user: User) {
    if(this.user && this.user.settings && this.user.settings.currentWallpaper) {
      return `url(${this.user.settings.currentWallpaper})`;
    } else {
      return '';
    }
  }

  
}