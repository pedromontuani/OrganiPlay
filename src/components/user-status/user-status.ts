import { Component, Input } from '@angular/core';
import { Status } from '../../models/status.model';

@Component({
  selector: 'user-status',
  templateUrl: 'user-status.html'
})
export class UserStatusComponent {

  @Input() status: Status;


  constructor() { }

  getNivel(xp: number): number {
    let xpNecessario = 0;
    let nivel = 1;
    while (true) {
      xpNecessario = (50 / 3 * (Math.pow(nivel, 3) - 6 * Math.pow(nivel, 2) + 17 * nivel - 12));
      if (xp == xpNecessario) {
        return nivel;
      } else if (xp < xpNecessario) {
        return nivel - 1;
      } else {
        nivel++;
      }
    }
  }

  getHPNivel(xp: number): number {
    return (this.getNivel(xp) -8) * 15 + 190;
  }

  getHPPorcentagem(xp: number, hp: number) {
    let porcentagem: number = (hp / this.getHPNivel(xp)) * 100;
    return porcentagem.toFixed(1);
  }

  getXPPorcentagem(xp: number) {
    let nivel: number = this.getNivel(xp)+1;
    let porcentagem = (xp / (50 / 3 * (Math.pow(nivel, 3) - 6 * Math.pow(nivel, 2) + 17 * nivel - 12))) * 100;
    return porcentagem.toFixed(1);
  }

}