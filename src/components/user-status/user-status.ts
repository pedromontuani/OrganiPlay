import { Component, Input } from '@angular/core';
import { Status } from '../../models/status.model';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'user-status',
  templateUrl: 'user-status.html'
})
export class UserStatusComponent {

  @Input() status: Status;

  constructor(
    public userProvider: UserProvider
  ) { }

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