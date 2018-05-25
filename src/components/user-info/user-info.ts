import { Component, Input } from '@angular/core';
import { User } from './../../models/user.model';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent {

  @Input() isMenu: boolean = false;
  @Input() user: User;
  heart: string = "heart";

  constructor() {
    console.log('Hello UserInfoComponent Component');
  }

}