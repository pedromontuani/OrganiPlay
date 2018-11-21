import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Habito } from '../../models/habito.model';

import { Observable } from 'rxjs/Observable';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';

/*
  Generated class for the HabitosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HabitosProvider extends BaseProvider{

  constructor(public http: Http, public db: AngularFireDatabase, public device: Device) {
    super();
  }

  novoHabito(habito: Habito, uid: string): Promise<void>{
    return this.db.list(`/habitos/${uid}`) 
      .push(habito).transaction(() => {}, () => {})
        .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  deletarHabito(key: string, uid: string): Promise<void> {
    return this.db.object(`/habitos/${uid}/${key}`).remove()
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  getHabitosObservable(uid: string): Observable<Habito[]> {
    return this.mapListKeys(this.db.list(`/habitos/${uid}`));
  }

}
