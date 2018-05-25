import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovoHabitoPage } from './novo-habito';

@NgModule({
  declarations: [
    NovoHabitoPage,
  ],
  imports: [
    IonicPageModule.forChild(NovoHabitoPage),
  ],
})
export class NovoHabitoPageModule {}
