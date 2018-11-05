import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovoTemaPage } from './novo-tema';

@NgModule({
  declarations: [
    NovoTemaPage,
  ],
  imports: [
    IonicPageModule.forChild(NovoTemaPage),
  ],
})
export class NovoTemaPageModule {}
