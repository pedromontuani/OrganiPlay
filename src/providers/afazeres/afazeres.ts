import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Afazer } from '../../models/afazer.model';
import { AuthProvider } from '../auth/auth';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';

/*
  Generated class for the AfazeresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AfazeresProvider extends BaseProvider {

  constructor(public http: Http, public db: AngularFireDatabase, public authService: AuthProvider, public device: Device) {
    super();
  }

  novoAfazer(habito: Afazer, uid: string): Promise<void> {
    return this.db.list(`/afazeres/${uid}`)
      .push(habito).transaction(() => { }, () => { })
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  finalizarAfazer(key: string, uid: string): Promise<void> {
    let finalizado: boolean = true;
    return this.db.object(`/afazeres/${uid}/${key}`).update({ finalizado: finalizado })
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  deletarTarefa(key: string, uid: string): Promise<void> {
    return this.db.object(`/afazeres/${uid}/${key}`).remove()
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  getAfazeresObservable(uid: string): Observable<Afazer[]> {
    return this.mapListKeys(this.db.list(`/afazeres/${uid}`))
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  getAfazerObservable(key: string, uid: string): Observable<Afazer> {
    return this.mapObjectKey(this.db.object(`afazeres/${uid}/${key}`))
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }
}
