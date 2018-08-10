import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';
import { AngularFireDatabase } from 'angularfire2/database';
import { Mundo } from '../../models/mundo.model';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the MundosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MundosProvider extends BaseProvider{

  constructor(public http: Http, public db: AngularFireDatabase) {
    super();
  }

  novoMundo(mundo: Mundo): Promise<void>{
    return this.db.list(`/mundos`) 
      .push(mundo).transaction(() => {}, () => {})
        .catch(this.handlePromiseError);
  }

  getMundosObservable(uid: string): Observable<Mundo[]> {
    return this.mapListKeys(this.db.list(`/mundos`));
  }

  getMundosGMObservable(gmUID: string): Observable<Mundo[]> {
    return this.mapListKeys(this.db.list(`/mundos`));
  }

}
