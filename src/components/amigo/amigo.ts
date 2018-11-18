import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'amigo',
  templateUrl: 'amigo.html'
})
export class AmigoComponent {

  player: User

  constructor(public userProvider: UserProvider) {
    
  }

  getNivel(xp: number): number {
    return this.userProvider.getNivel(xp);
  }

  getHPNivel(xp: number): number {
    return (this.getNivel(xp) -8) * 15 + 190;
  }

  getHPPorcentagem(xp: number, hp: number) {
    return this.userProvider.getHPPorcentagem(xp, hp);
  }

  getXPPorcentagem(xp: number) {
    return this.userProvider.getXPPorcentagem(xp);
  }

}
