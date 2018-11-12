import { Component, Input } from '@angular/core';
import { ItemLojaAvatar } from '../../models/item-loja-avatar.model';
import { ItemLojaPocao } from '../../models/item-loja-pocao.model';

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

  @Input() itemLoja: any;
  @Input() isComprado: boolean;
  @Input() isUsando: boolean = false;

  constructor() {

  }

}
