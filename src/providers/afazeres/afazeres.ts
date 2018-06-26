import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Afazer } from '../../models/afazer.model';

/*
  Generated class for the AfazeresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AfazeresProvider extends BaseProvider{

  constructor(public http: Http, public db: AngularFireDatabase) {
    super();
  }

  novoAfazer(habito: Afazer, uid: string): Promise<void>{
    return this.db.list(`/afazeres/${uid}`) 
      .push(habito).transaction(() => {}, () => {})
        .catch(this.handlePromiseError);
  }

  finalizarAfazer(key: string, uid: string): Promise<void>{
    return this.db.object(`/afazeres/${uid}/${key}`).remove();
  }

  getAfazeresObservable(uid: string): Observable<Afazer[]> {
    return this.mapListKeys(this.db.list(`/afazeres/${uid}`))
      .catch(this.handlePromiseError);
  }
}
