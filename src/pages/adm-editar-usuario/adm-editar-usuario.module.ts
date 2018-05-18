import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdmEditarUsuarioPage } from './adm-editar-usuario';

@NgModule({
  declarations: [
    AdmEditarUsuarioPage,
  ],
  imports: [
    IonicPageModule.forChild(AdmEditarUsuarioPage),
  ],
})
export class AdmEditarUsuarioPageModule {}
