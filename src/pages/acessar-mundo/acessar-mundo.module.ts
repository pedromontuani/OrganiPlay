import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcessarMundoPage } from './acessar-mundo';

@NgModule({
  declarations: [
    AcessarMundoPage,
  ],
  imports: [
    IonicPageModule.forChild(AcessarMundoPage),
  ],
})
export class AcessarMundoPageModule {}
