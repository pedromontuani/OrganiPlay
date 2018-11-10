import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';
import { AuthProvider } from '../providers/auth/auth';
import { AdminPage } from '../pages/Administrador/admin/admin';
import { AdminProvider } from '../providers/admin/admin';
import { User } from '../models/user.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  currentUser: User;
  currentUserUid: string;

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
          this.currentUserUid = authProvider.userUID;
        });
        userProvider.currentUser.subscribe((user: User) => {
          this.currentUser = user;
          platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();
          });
        });
      } else {
        this.rootPage = LoginPage;
        platform.ready().then(() => {
          statusBar.styleDefault();
          splashScreen.hide();
        });
      }
    });    
  }


}
