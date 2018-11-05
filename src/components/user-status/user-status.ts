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

  getRemainingLevel(xp: number) {
    
  }

}