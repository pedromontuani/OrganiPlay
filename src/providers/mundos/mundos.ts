import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Mundo } from '../../models/mundo.model';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { Afazer } from '../../models/afazer.model';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { SubmissaoTarefa } from '../../models/submissao-tarefa.model';
import { RecompensaMundo } from '../../models/recompensa-mundo.model';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';
import { NotificationsProvider } from '../notifications/notifications';
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
    public device: Device,
    public notificationsProvider: NotificationsProvider,
    @Inject(FirebaseApp) public firebaseApp: any
  ) {
    super();
  }

  novoMundo(mundo: Mundo): Promise<void> {
    return this.db.list(`/mundos`)
      .push(mundo).transaction(() => { }, () => {})
      .then(() => {
        mundo.players.split(" ").filter(player => player != " ").forEach(player => {
          this.notificationsProvider.sendNotification(
            mundo.mundo,
            `Você foi adicionado(a) ao mundo "${mundo.mundo}"`,
            player
          );
        });
      })
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  getMundosObservable(uid: string): Observable<Mundo[]> {
    return this.mapListKeys(this.db.list(`/mundos`, ref => ref.orderByChild('gmUID')))
      .map((mundos: Mundo[]) => {
        return mundos.filter(
          (mundo: Mundo) => mundo.players.toString().split(" ").filter(value => { return value != " " }).indexOf(uid) != -1
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

  getPlayersByKeysArray($keys: string[]): Observable<User[]> {
    return this.mapListKeys(this.db.list<User>('/users',
      (ref: firebase.database.Reference) => ref.orderByChild('username')))
      .map((users: User[]) => {
        return users.filter((user: User) => user && ($keys.indexOf(user.$key) != -1));
      });
  }

  adicionarJogadores($keyMundo: string, players: string): Promise<void> {
    return this.db.object(`/mundos/${$keyMundo}`)
      .update({ players: players })
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  excluirUsuario(userUid: string, $keyMundo: string, playersKeysString: string): Promise<void> {
    let tempPlayersKeys: string[] = [];
    playersKeysString.split(" ").filter(value => { return value != " " }).forEach(playerKey => {
      if (playerKey != userUid) {
        tempPlayersKeys.push(playerKey);
      }
    });
    return this.db.object(`/mundos/${$keyMundo}`)
      .update({ players: tempPlayersKeys.join(" ") })
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  novaTarefa($keyMundo: string, tarefa: Afazer): Promise<void> {
    return this.db.list(`/afazeres/mundos/${$keyMundo}/`)
      .push(tarefa).transaction(() => { }, () => { })
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
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
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
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
      .child(`/mundos/${$keyMundo}/comprovacoes/${$keyTarefa}/${userUid}.jpg`)
      .putString(base64, 'base64', { contentType: 'image/jpeg' });
  }

  getSubmissaoTarefas($keyTarefa: string, $keyMundo: string, uid: string): Observable<SubmissaoTarefa> {
    return this.mapObjectKey(
      this.db.object(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes/${uid}`)
    );
  }

  getSubmissoesTarefas($keyTarefa: string, $keyMundo: string): Observable<SubmissaoTarefa[]> {
    return this.mapListKeys(
      this.db.list(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes`)
    );
  }

  updateComprovacao($keyTarefa: string, $keyMundo: string, uid: string, dados: { verificado: boolean }): Promise<void> {
    return this.db.object(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes/${uid}`)
      .update(dados)
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  deleteComprovacao($keyTarefa: string, $keyMundo: string, uid: string): Promise<void> {
    return this.db.object(`/afazeres/mundos/${$keyMundo}/${$keyTarefa}/submissoes/${uid}`)
      .remove()
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  novaRecompensa($keyMundo: string, recompensa: RecompensaMundo): firebase.database.ThenableReference {
    this.getMundoObject($keyMundo)
      .first()
      .subscribe(mundo => {
        this.notificationsProvider.sendNotification(
          mundo.mundo,
          `Nova recompensa adicionada ao mundo ${mundo.mundo}`,
          $keyMundo
        );
      });
    return this.db.list(`/recompensas/mundos/${$keyMundo}`)
      .push(recompensa);
  }

  updateRecompensa($keyMundo: string, $keyRecompensa: string, data): Promise<void> {
    return this.db.object(`/recompensas/mundos/${$keyMundo}/${$keyRecompensa}`)
      .update(data)
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  enviarFotoRecompensa(
    $keyMundo: string,
    $keyRecompensa: string,
    base64: string,
  ): Promise<void> {
    return firebase
      .storage()
      .ref()
      .child(`/mundos/${$keyMundo}/recompensas/${$keyRecompensa}.jpg`)
      .putString(base64, 'base64', { contentType: 'image/jpeg' })
      .then((snapshot) => {
        this.updateRecompensa($keyMundo, $keyRecompensa, { photoUrl: snapshot.downloadURL })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getRecompensasMundo($keyMundo: string): Observable<RecompensaMundo[]> {
    return this.mapListKeys(this.db.list(`/recompensas/mundos/${$keyMundo}`));
  }

  updateRecompensaMundo($keyMundo: string, $keyRecompensa: string, data): Promise<any> {
    return this.db.object(`/recompensas/mundos/${$keyMundo}/${$keyRecompensa}`)
      .update(data)
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }

  excluirMundo($keyMundo): Promise<void> {
    return this.db.object(`/afazeres/mundos/${$keyMundo}`).remove()
      .then(() => {
        return this.db.object(`/recompensas/mundos/${$keyMundo}`).remove()
          .then(() => {
            return firebase.storage().ref().child(`/mundos/${$keyMundo}`).delete()
              .then(() => {
                return this.db.object(`/mundos/${$keyMundo}`).remove()
                  .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
              })
              .catch(err => {
                if (err.code.indexOf("object-not-found") > -1) {
                  return this.db.object(`/mundos/${$keyMundo}`).remove()
                    .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
                } else {
                  return this.handlePromiseError(err, this.db, this.device);
                }
              });
          })
          .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
      })
      .catch(err => { return this.handlePromiseError(err, this.db, this.device); });
  }



}
