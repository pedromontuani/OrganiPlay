import { Component } from '@angular/core';
import { Platform, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';
import { AuthProvider } from '../providers/auth/auth';
import { AdminPage } from '../pages/Administrador/admin/admin';
import { AdminProvider } from '../providers/admin/admin';
import { User } from '../models/user.model';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { AppMinimize } from '@ionic-native/app-minimize';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  currentUser: User;
  currentUserUid: string;
  currentTheme: string = "purple-theme";
  ionNavId: string = "";

  constructor(
    splashScreen: SplashScreen,
    adminProvider: AdminProvider,
    app: App,
    public statusBar: StatusBar,
    public platform: Platform,
    public userProvider: UserProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public push: Push,
    public notificationsProvider: NotificationsProvider,
    public appMinimize: AppMinimize,
    public localNotifications: LocalNotifications,
    public storage: Storage
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
        this.platform.ready().then(() => {
          this.firstAccess();
          this.statusBar.overlaysWebView(true);
          splashScreen.hide();
          this.updateTheme();
          this.notificationSubscribe(authProvider.userUID);
          userProvider.currentUser.subscribe((user: User) => {
            this.currentUser = user;
          });
        });
      } else {
        this.rootPage = LoginPage;
        this.platform.ready().then(() => {
          this.firstAccess();
          this.statusBar.overlaysWebView(true);
          splashScreen.hide();
        });
      }
    });

    this.platform.registerBackButtonAction(() => {
      let nav = app.getActiveNavs()[0];
      if (nav.canGoBack()) {
        nav.pop();
      } else {
        if(this.platform.is('android')) {
          this.appMinimize.minimize()
        } else {
          this.platform.exitApp();
        }
      }
    });
  }

  updateTheme(): void {
    this.userProvider.getUserSettings(this.authProvider.userUID)
      .subscribe(settings => {
        if (settings) {
          this.currentTheme = settings.currentTheme;
          if(this.currentTheme == "dark-theme"){
            this.statusBar.styleBlackOpaque();
          } else if(this.currentTheme == "purple-theme") {
            this.statusBar.styleLightContent();
          } else {
            this.statusBar.styleDefault();
          }
        }
      });
      
    if(this.platform.is('android')) {
      this.ionNavId = "ion-nav";
    }
  }

  notificationSubscribe(uid: string): void {
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });

    const options: PushOptions = {
      android: { senderID: '805916840528', forceShow: true },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
    };


    let pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration)
    });

    pushObject.subscribe('global')
      .then(() => {
        console.log("Subscribed on global");
      })
      .catch(err => {
        console.log(err);
      });

    pushObject.subscribe(uid)
      .then(() => {
        console.log("Subscribed on user UID");
      })
      .catch(err => {
        console.log(err);
      });

    this.notificationsProvider
      .getUserNotificationSettings(uid)
      .subscribe(settings => {
        if (settings && settings.topics) {
          this.notificationsProvider.getAllTopics()
            .first()
            .subscribe(topics => {
              if (topics && topics.topics) {
                topics.topics.split(" ").forEach(topic => {
                  if (topic.length > 1) {
                    pushObject.unsubscribe(topic)
                      .then(() => {
                        console.log(`Unsubscribed on ${topic}`);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                });
                settings.topics.split(" ").forEach(topic => {
                  if (topic.length > 1) {
                    pushObject.subscribe(topic)
                      .then(() => {
                        console.log(`Subscribed on ${topic}`);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                });
              }
            });
        }
      });

    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
    });

  }

  firstAccess(): void {
    this.storage.get('first_access')
      .then(
        (data) => {
          console.log(data);
          if(data) {
            //não é o primeiro acesso
          } else {
            //é o primeiro acesso
            this.storage.set('first_access', true)
              .then(() => {
                console.log("Primeiro acesso registrado");
              })
              .catch(err => {
                console.log(err);
              });

            this.localNotifications.requestPermission()
              .catch(err => {
                console.log(err);
              });
          }
        })
      .catch(err => {
        console.log(err);
      });
  }


}
