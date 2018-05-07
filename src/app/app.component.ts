import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';
import { AuthProvider } from '../providers/auth/auth';
import { AdminPage } from '../pages/admin/admin';
import { AdminProvider } from '../providers/admin/admin';
import { User } from '../models/user.model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  currentUser: User;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    userProvider: UserProvider,
    authProvider: AuthProvider,
    adminProvider: AdminProvider
  ) {

    authProvider.auth.authState.subscribe((authUser) => {
      if (authUser) {
        authProvider.setUid();
        userProvider.getUserById(authProvider.userUID);

        userProvider.isAdmin.then(() => {
          this.rootPage = AdminPage;
          adminProvider.getUsers();
        }).catch(() => {
          this.rootPage = TabsPage;
        });
        userProvider.currentUser.subscribe((user: User) => {
          this.currentUser = user;
        });
      } else {
        this.rootPage = LoginPage;
      }
    });    

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

}
