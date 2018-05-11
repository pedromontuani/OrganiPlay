import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HabitosPage } from './habitos';

@NgModule({
  declarations: [
    HabitosPage,
  ],
  imports: [
    IonicPageModule.forChild(HabitosPage),
  ],
})
export class HabitosPageModule {}
