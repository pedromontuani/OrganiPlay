import { Component } from '@angular/core';

/**
 * Generated class for the ItemLojaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-loja',
  templateUrl: 'item-loja.html'
})
export class ItemLojaComponent {

  text: string;

  constructor() {
    console.log('Hello ItemLojaComponent Component');
    this.text = 'Hello World';
  }

}
