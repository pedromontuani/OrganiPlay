import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Habito } from '../../models/habito.model';
import { BaseProvider } from '../base/base';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the HabitosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HabitosProvider extends BaseProvider{

  constructor(public http: Http, public db: AngularFireDatabase) {
    super();
  }

  novoHabito(habito: Habito, uid: string): Promise<void>{
    return this.db.list(`/habitos/${uid}`) 
      .push(habito).transaction(() => {}, () => {})
        .catch(this.handlePromiseError);
  }

  getHabitosObservable(uid: string): Observable<Habito[]> {
    return this.mapListKeys(this.db.list(`/habitos/${uid}`));
  }

}
