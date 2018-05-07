import { Component, Input } from '@angular/core';
import { User } from './../../models/user.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent {

  @Input() isMenu: boolean = false;
  @Input() user: User;

  constructor() {
    console.log('Hello UserInfoComponent Component');
  }

}