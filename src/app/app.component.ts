import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';
import { AuthProvider } from '../providers/auth/auth';
import { User } from '../models/user.model';
import { AdminPage } from '../pages/admin/admin';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    userProvider: UserProvider,
    authProvider: AuthProvider,
  ) {

    authProvider.auth.authState.subscribe((authUser) => {
      if (authUser) {
        authProvider.setUid();
        userProvider.getUserById(authProvider.userUID);

        userProvider.isAdmin.then(() => {
          this.rootPage = AdminPage;
        }).catch(() => {
          this.rootPage = TabsPage;
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
