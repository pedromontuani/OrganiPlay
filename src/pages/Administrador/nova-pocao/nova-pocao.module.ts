import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovaPocaoPage } from './nova-pocao';

@NgModule({
  declarations: [
    NovaPocaoPage,
  ],
  imports: [
    IonicPageModule.forChild(NovaPocaoPage),
  ],
})
export class NovaPocaoPageModule {}
