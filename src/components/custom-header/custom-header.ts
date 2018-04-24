import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AlertController, App, MenuController } from 'ionic-angular';

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

  constructor(public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController) {
    super(alertCtrl, app, menuCtrl);
  }

}
