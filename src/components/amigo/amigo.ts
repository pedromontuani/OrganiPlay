import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'amigo',
  templateUrl: 'amigo.html'
})
export class AmigoComponent {

  @Input() amigo: User

  constructor(public userProvider: UserProvider, public photoViewer: PhotoViewer) {
    
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

  onClickAvatar() {
    if(this.amigo.settings.currentAvatar) {
      this.photoViewer.show(this.amigo.settings.currentAvatar);
    }
  }

}
