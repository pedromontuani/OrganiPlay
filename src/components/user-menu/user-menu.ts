import { Component } from '@angular/core';

/**
 * Generated class for the UserMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent {

  text: string;

  constructor() {
    console.log('Hello UserMenuComponent Component');
    this.text = 'Hello World';
  }

  onProfile() {
    console.log('Hello UserMenuComponent Component');
  }

  onLogout() {
    console.log('Hello UserMenuComponent Component');
  }

}
