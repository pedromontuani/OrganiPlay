import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Habito } from '../../models/habito.model';
import { Observable } from 'rxjs/Observable';
import { Recompensa } from '../../models/recompensa.model';

/*
  Generated class for the RecompensasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RecompensasProvider extends BaseProvider{

  constructor(public http: Http, public db: AngularFireDatabase) {
    super(db);
  }

  novaRecompensa(recompensa: Recompensa, uid: string): Promise<void>{
    return this.db.list(`/recompensas/${uid}`) 
      .push(recompensa).transaction(() => {}, () => {})
        .catch(this.handlePromiseError);
  }

  excluirRecompensa(key: string, uid: string): Promise<void> {
    return this.db.object(`/recompensas/${uid}/${key}`).remove()
      .catch(this.handlePromiseError);
  }

  getRecompensasObservable(uid: string): Observable<Recompensa[]> {
    return this.mapListKeys(this.db.list(`/recompensas/${uid}`));
  }

}
