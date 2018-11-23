import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { NotificationSettings } from '../../models/notification-settings.model';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';
import { User } from '../../models/user.model';
import { Mundo } from '../../models/mundo.model';

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
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
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
      console.log('Device registered', registration);
      this.pushObject.subscribe('global')
        .then(() => console.log("Subscribed on global"))
        .catch(err => { this.handlePromiseError(err, this.db, this.device) })

      this.pushObject.subscribe(uid)
        .then(() => console.log("Subscribed on user UID"))
        .catch(err => { this.handlePromiseError(err, this.db, this.device) })

      this.mapListKeys(this.db.list("/users")).first().subscribe((users: User[]) => {
        if (users) {
          users.forEach(user => {
            if (user.$key != uid) {
              this.pushObject.unsubscribe(user.$key);
            }
          });
        }
      });

      this.mapListKeys(this.db.list("/mundos")).subscribe((mundos: Mundo[]) => {
        if (mundos) {
          mundos.forEach(mundo => {
            if (mundo.players.split(" ").indexOf(uid) != -1) {
              this.pushObject.subscribe(mundo.$key)
                .then(() => {console.log("Subscribed on mundo", mundo)})
                .catch(err => { this.handlePromiseError(err, this.db, this.device) });
            } else {
              this.pushObject.unsubscribe(mundo.$key)
                .then(() => {console.log("Unsubscribed on mundo", mundo)})
                .catch(err => { this.handlePromiseError(err, this.db, this.device) });
            }
          });
        }
      });
    });

    this.pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
    });
  }

  sendNotification(title: string, message: string, topic: string) {
    let header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", "key=AAAAu6RjElA:APA91bGoi0jqJZDoA7H3XJ4e6-4esLwAtHfDfgC-iKzECp8XzDz66HKGcXu6LT63lijluJmRqtcBrM_hDj-KOVB0dxow8rWrpTWNUlVCA5_GvNepH40O4DgdX2EL-vLPmX11KvT7Xw1d");

    let notificacao = {
      "notification": {
        "title": title,
        "body": message
      },
      "to": `/topics/${topic}`
    };

    this.http.post("https://fcm.googleapis.com/fcm/send", notificacao, { headers: header })
      .toPromise()
      .catch(err => {
        this.handlePromiseError(err, this.db, this.device);
      });
  }

}
