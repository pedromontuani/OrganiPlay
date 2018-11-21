import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { NotificationSettings } from '../../models/notification-settings.model';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider extends BaseProvider {

  public pushObject: PushObject;

  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    public localNotifications: LocalNotifications,
    public push: Push,
    public device: Device
  ) {
    super();
  }

  getAllTopics(): Observable<NotificationSettings> {
    return this.mapObjectKey(this.db.object("notification-settings/global"))
  }

  updateAllTopics(): Observable<NotificationSettings> {
    return this.mapObjectKey(this.db.object("notification-settings/global"))
  }

  getUserNotificationSettings(uid: string): Observable<NotificationSettings> {
    return this.mapObjectKey(this.db.object(`notification-settings/${uid}`));
  }

  updateUserNotificationSettings(uid: string, data: any): Promise<void> {
    return this.db.object(`notification-settings/${uid}`)
      .update(data)
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  scheduleLocalNotification(id: number, titulo: string, texto: string, data: Date): void {
    this.localNotifications.schedule({
      id: id,
      title: titulo,
      text: texto,
      trigger: { at: data },
      launch: true,
      foreground: true
    });
  }

  cancelNotificationContainingString(str: string) {
    this.localNotifications.getAll()
      .then(notifications => {
        notifications.forEach(notification => {
          if (notification.title.indexOf(str) > -1 || notification.text.indexOf(str) > -1) {
            this.localNotifications.cancel(notification.id);
          }
        });
      })
      .catch(err => {
        console.log(err);
      });

    this.localNotifications.getAll()
      .then(notifications => {
        console.log(notifications);
      })
      .catch(err => {
        console.log(err);
      })

  }

  initPush(uid: string) {
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


    this.pushObject = this.push.init(options);

    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration)
    });

    this.pushObject.subscribe('global')
      .then(() => {
        console.log("Subscribed on global");
      })
      .catch(err => {
        console.log(err);
      });

    this.pushObject.subscribe(uid)
      .then(() => {
        console.log("Subscribed on user UID");
      })
      .catch(err => {
        console.log(err);
      });


    this.getUserNotificationSettings(uid)
      .subscribe(settings => {
        if (settings && settings.topics) {
          this.getAllTopics()
            .first()
            .subscribe(topics => {
              if (topics && topics.topics) {
                topics.topics.split(" ").filter(value => { return value != " " }).forEach(topic => {
                  if (topic.length > 1) {
                    this.pushObject.unsubscribe(topic)
                      .then(() => {
                        console.log(`Unsubscribed on ${topic}`);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                });
                settings.topics.split(" ").filter(value => { return value != " " }).forEach(topic => {
                  if (topic.length > 1) {
                    this.pushObject.subscribe(topic)
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

    this.pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
    });
  }

}
