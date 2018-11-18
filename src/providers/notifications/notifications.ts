import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { NotificationSettings } from '../../models/notification-settings.model';
import { BaseProvider } from '../base/base';
import { LocalNotifications } from '@ionic-native/local-notifications';

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider extends BaseProvider {

  constructor(public http: Http, public db: AngularFireDatabase, public localNotifications: LocalNotifications) {
    super(db);
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
      .catch(this.handlePromiseError);
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
          if(notification.title.indexOf(str) > -1 || notification.text.indexOf(str) > -1){
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

}
