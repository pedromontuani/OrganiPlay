import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { SolicitacaoAmizade } from '../../models/solicitacao-amizade.model';
import { BaseProvider } from '../base/base';
import { Device } from '@ionic-native/device';
import { UserProvider } from '../user/user';
import { Status } from '../../models/status.model';
import { ItemLojaPocao } from '../../models/item-loja-pocao.model';
import { LojaProvider } from '../loja/loja';

@Injectable()
export class AmigosProvider extends BaseProvider{

  constructor(
      public http: Http,
      public db: AngularFireDatabase,
      public device: Device,
      public userProvider: UserProvider,
      public lojaProvider: LojaProvider
    ) {
    super();
  }

  getAmigosList(uid: string): Observable<string> {
    return this.db.object<string>(`users/${uid}/amigos`).valueChanges();
  }

  getAmigoObj(uid: string): Observable<User> {
    return this.mapObjectKey(this.db.object(`/users/${uid}`));
  }

  getPlayersObjs(playersUids: string[]): Observable<User[]> {
    return this.mapListKeys(this.db.list(`/users`, ref => ref.orderByChild("username")))
      .map((users: User[]) => {
        return users.filter(user => playersUids.indexOf(user.$key) != -1);
      });
  }

  getPlayersParaEnviarSolicitacao(uid: string, amigosList: string[]) {
    return this.mapListKeys(this.db.list<User>('/users',
        (ref: firebase.database.Reference) => ref.orderByChild('username')))
        .map((users: User[]) => {
          return users.filter((user: User) => user.type !== "adm"
            && user.$key !== uid && amigosList.indexOf(user.$key) == -1
          );
        });
  }

  addAmigo(playerUid: string, amigoUid: string,
    playerAmigosList: string, amigoAmigosList: string): Promise<void> {
    let newPlayerAmigosList: string[] = playerAmigosList.split(" ").filter(value =>  value != " ");
    let newAmigoAmigosList: string[] = amigoAmigosList.split(" ").filter(value =>  value != " ");

    newPlayerAmigosList.push(amigoUid);
    newAmigoAmigosList.push(playerUid);

    return this.db.object(`/users/${playerUid}`)
      .update({amigos : newPlayerAmigosList.join(" ")})
        .then(() => {
          this.db.object(`/users/${amigoUid}`)
            .update({amigos : newAmigoAmigosList.join(" ")})
            .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
        })
        .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  removeAmigo(playerUid: string, amigoUid: string,
  playerAmigosList: string, amigoAmigosList: string): Promise<void> {

    let newPlayerAmigosList: string[] = playerAmigosList.split(" ").filter(value => {return value != " "});
    let newAmigoAmigosList: string[] = amigoAmigosList.split(" ").filter(value => {return value != " "});
    
    newPlayerAmigosList = newPlayerAmigosList.filter(player => {
      return player != amigoUid && player != " ";
    });

    newAmigoAmigosList = newPlayerAmigosList.filter(player => {
      return player != playerUid && player != " ";
    });

    return this.db.object(`/users/${playerUid}`)
      .update({amigos : newPlayerAmigosList.join(" ")})
      .then(() => {
        this.db.object(`/users/${amigoUid}`)
        .update({amigos : newAmigoAmigosList.join(" ")})
        .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
      })
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  sendSolicitacao(senderUid: string, receiverUid: string, senderSolicitacoes: SolicitacaoAmizade[]) {
    let canSend: boolean = true;
    
    if(senderSolicitacoes) {
      senderSolicitacoes.forEach(solicitacao => {
        if(solicitacao.senderUid == receiverUid) {
          canSend = false;
        }
      });
    }

    if(canSend) {
      this.getPlayerSolicitacoes(receiverUid)
      .first()
      .subscribe(solicitacoes => {

        if(solicitacoes) {
          solicitacoes.forEach(solicitacao => {
            if(solicitacao.senderUid == senderUid){
              canSend = false;
            }
          });
        }

        if(canSend){
          this.db.list(`/solicitacoes-amizade/${receiverUid}`)
            .push(new SolicitacaoAmizade(senderUid))
            .transaction(() => {}, (a,b,c) => {if (a) { console.log(a) }})
            .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
        }
      });
    }
    
  }

  deleteSolicitacao(playerUid: string, solicitacaoKey: string): Promise<void> {
    return this.db.object(`/solicitacoes-amizade/${playerUid}/${solicitacaoKey}`)
      .remove()
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  aceitarSolicitacao(solicitacaoKey: string, senderUid: string, receiverUid: string, 
  senderAmigosList: string, receiverAmigosList: string): Promise<void> {
    return this.addAmigo(receiverUid, senderUid, receiverAmigosList, senderAmigosList)
      .then(() => {
        return this.deleteSolicitacao(receiverUid, solicitacaoKey)
          .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
      })
      .catch(err => {         return this.handlePromiseError(err, this.db, this.device);       });
  }

  getPlayerSolicitacoes(playerUid: string): Observable<SolicitacaoAmizade[]> {
    return this.mapListKeys(this.db.list(`/solicitacoes-amizade/${playerUid}`));
  }

  reviverAmigo(amigoObj: User, newAmigoStatus: Status, playerUid: string, pocaoVida: ItemLojaPocao, pocoesPlayer: string): Promise<void> {
    return this.userProvider.updateStatus(amigoObj.status, newAmigoStatus, amigoObj.$key)
      .then(() => {
        return this.lojaProvider.usarItem(
            pocaoVida, 
            playerUid, 
            pocoesPlayer.split(" ").filter(pocao => pocao != pocaoVida.$key && pocao != " ").join(" ")
          ).catch(err => {this.handlePromiseError(err, this.db, this.device)});
      })
      .catch(err => {this.handlePromiseError(err, this.db, this.device)});
  }

}
