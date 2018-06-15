import { Component, ViewChild } from '@angular/core';
import { MenuController, Tabs } from 'ionic-angular';
import { HabitosPage } from '../habitos/habitos';
import { AfazeresPage } from '../afazeres/afazeres';
import { RecompensasPage } from '../recompensas/recompensas';
import { UserProvider } from '../../providers/user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HabitosPage;
  tab2Root = AfazeresPage
  tab3Root = RecompensasPage;

  constructor(
    public menuCtrl: MenuController
  ) {
    menuCtrl.enable(true, "user-menu");
  }
}
