import { Component, Input } from '@angular/core';
import { Status } from '../../models/status.model';

@Component({
  selector: 'user-status',
  templateUrl: 'user-status.html'
})
export class UserStatusComponent {

  @Input() status: Status;


  constructor() {}

}