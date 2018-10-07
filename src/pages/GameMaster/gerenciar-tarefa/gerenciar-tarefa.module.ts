import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GerenciarTarefaPage } from './gerenciar-tarefa';

@NgModule({
  declarations: [
    GerenciarTarefaPage,
  ],
  imports: [
    IonicPageModule.forChild(GerenciarTarefaPage),
  ],
})
export class GerenciarTarefaPageModule {}
