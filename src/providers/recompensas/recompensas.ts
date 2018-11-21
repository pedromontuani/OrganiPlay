import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Habito } from '../../models/habito.model';
import { Observable } from 'rxjs/Observable';
import { Recompensa } from '../../models/recompensa.model';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';

/*
  Generated class for the RecompensasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RecompensasProvider extends BaseProvider {

  constructor(public http: Http, public db: AngularFireDatabase, public device: Device) {
    super();
  }

  novaRecompensa(recompensa: Recompensa, uid: string): Promise<void> {
    return this.db.list(`/recompensas/${uid}`)
      .push(recompensa).transaction(() => { }, () => { })
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  excluirRecompensa(key: string, uid: string): Promise<void> {
    return this.db.object(`/recompensas/${uid}/${key}`).remove()
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  getRecompensasObservable(uid: string): Observable<Recompensa[]> {
    return this.mapListKeys(this.db.list(`/recompensas/${uid}`));
  }

}
