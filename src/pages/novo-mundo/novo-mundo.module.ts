import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovoMundoPage } from './novo-mundo';

@NgModule({
  declarations: [
    NovoMundoPage,
  ],
  imports: [
    IonicPageModule.forChild(NovoMundoPage),
  ],
})
export class NovoMundoPageModule {}
