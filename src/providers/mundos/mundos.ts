import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { BaseProvider } from '../base/base';
import { AngularFireDatabase } from 'angularfire2/database';
import { Mundo } from '../../models/mundo.model';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { Afazer } from '../../models/afazer.model';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { SubmissaoTarefa } from '../../models/submissao-tarefa.model';
/*
  Generated class for the MundosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MundosProvider extends BaseProvider {

  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    @Inject(FirebaseApp) public firebaseApp: any
  ) {
    super();
  }

  novoMundo(mundo: Mundo): Promise<void> {
    return this.db.list(`/mundos`)
      .push(mundo).transaction(() => { }, () => { })
      .catch(this.handlePromiseError);
  }

  getMundosObservable(uid: string): Observable<Mundo[]> {
    return this.mapListKeys(this.db.list(`/mundos`, ref => ref.orderByChild('gmUID')))
      .map((mundos: Mundo[]) => {
        return mundos.filter(
          (mundo: Mundo) => mundo.players.toString().split(" ").indexOf(uid) != -1
        );
      });
  }

  getMundosGmObservable(uid: string): Observable<Mundo[]> {
    return this.mapListKeys(this.db.list(`/mundos`, ref => ref.orderByChild('gmUID').equalTo(uid)));
  }

  getMundoObject($key: string): Observable<Mundo> {
    return this.mapObjectKey(this.db.object(`/mundos/${$key}`));
  }

  getUsersList(uid: string): Observable<User[]> {
    return this.mapListKeys(this.db.list<User>('/users',
      (ref: firebase.database.Reference) => ref.orderByChild('username')))
      .map((users: User[]) => {
        return users.filter((user: User) => user.type !== "adm"
          && user.$key !== uid
        );
      });
  }

  addUsersList($keys: string[], uidToExclude: string) {
    return this.mapListKeys(this.db.list<User>('/users',
      (ref: firebase.database.Reference) => ref.orderByChild('username')))
      .map((users: User[]) => {
        return users.filter((user: User) => user && user.type !== "adm" && user.$key != uidToExclude && ($keys.indexOf(user.$key) == -1));
      });
  }

  getPlayersMundo($keys: string[], uidToExclude: string): Observable<User[]> {
    return this.mapListKeys(this.db.list<User>('/users',
      (ref: firebase.database.Reference) => ref.orderByChild('username')))
      .map((users: User[]) => {
        return users.filter((user: User) => user && user.type !== "adm" && user.$key != uidToExclude && ($keys.indexOf(user.$key) != -1));
      });
  }

  getPlayersTarefas($keys: string[]): Observable<User[]>{
    return this.mapListKeys(this.db.list<User>('/users',
      (ref: firebase.database.Reference) => ref.orderByChild('username')))
      .map((users: User[]) => {
        return users.filter((user: User) => user && ($keys.indexOf(user.$key) != -1));
      });
  }

  adicionarJogadores($keyMundo: string, players: string): Promise<void> {
    return this.db.object(`/mundos/${$keyMundo}`)
      .update({ players: players })
      .catch(this.handlePromiseError);
  }

  excluirUsuario(userUid: string, $keyMundo: string, playersKeysString: string): Promise<void> {
    let tempPlayersKeys: string[] = [];
    playersKeysString.split(" ").forEach(playerKey => {
      if (playerKey != userUid) {
        tempPlayersKeys.push(playerKey);
      }
    });
    return this.db.object(`/mundos/${$keyMundo}`)
      .update({ players: tempPlayersKeys.join(" ") })
      .catch(this.handlePromiseError);
  }

  novaTarefa($keyMundo: string, tarefa: Afazer): Promise<void> {
    return this.db.list(`/afazeres/mundos/${$keyMundo}/`)
      .push(tarefa).transaction(() => { }, () => { })
      .catch(this.handlePromiseError);
  }

  getTarefasMundo($keyMundo: string): Observable<Afazer[]> {
    return this.mapListKeys(this.db.list(`/afazeres/mundos/${$keyMundo}/`))
      .map((tarefas: Afazer[]) => {
        return tarefas.filter((tarefa) => !tarefa.finalizado)
      });
  }

  finalizarTarefa(
    $keyTarefa: string,
    $keyMundo: string,
    uid: string,
    dados: SubmissaoTarefa
  ): Promise<void> {
    return this.db.object(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes/${uid}`)
      .set(dados)
      .catch(this.handlePromiseError);      
  }

  enviarComprovacao(
    $keyTarefa: string,
    $keyMundo: string,
    base64: string,
    userUid: string
  ): firebase.storage.UploadTask {
    return firebase
      .storage()
      .ref()
      .child(`/comprovacoes-mundo/${$keyMundo}/${$keyTarefa}/${userUid}.jpg`)
      .putString(base64, 'base64', {contentType: 'image/jpeg'});
  }

  getSubmissaoTarefas($keyTarefa: string, $keyMundo: string, uid: string ): Observable<SubmissaoTarefa> {
    return this.mapObjectKey(
      this.db.object(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes/${uid}`)
    );
  }

  getSubmissoesTarefas($keyTarefa: string, $keyMundo: string): Observable<SubmissaoTarefa[]> {
    return this.mapListKeys(
      this.db.list(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes`)
    );
  }

  updateComprovacao($keyTarefa: string, $keyMundo: string, uid: string, dados: { verificado: boolean}): Promise<void>{
    return this.db.object(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes/${uid}`)
      .update(dados)
      .catch(this.handlePromiseError);
  }

  deleteComprovacao($keyTarefa: string, $keyMundo: string, uid: string): Promise<void>{
    return this.db.object(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes/${uid}`)
      .remove()
      .catch(this.handlePromiseError);
  }

}
