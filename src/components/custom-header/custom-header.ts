import { Component, Input } from '@angular/core';
import { AlertController, App, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { BaseComponent } from '../base.component';

/**
 * Generated class for the CustomHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html'
})
export class CustomHeaderComponent extends BaseComponent{

  @Input() titulo: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController,
    public authProvider: AuthProvider,
  ) {
    super(alertCtrl, authProvider, app, menuCtrl);
  }

}
