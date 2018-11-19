import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { BaseProvider } from '../base/base';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { SolicitacaoAmizade } from '../../models/solicitacao-amizade.model';

@Injectable()
export class AmigosProvider extends BaseProvider{

  constructor(public http: Http, public db: AngularFireDatabase) {
    super(db);
  }

  getAmigosList(uid: string): Observable<string> {
    return this.db.object<string>(`users/${uid}/amigos`).valueChanges();
  }

  getPlayersObjs(playersUids: string[]): Observable<User[]> {
    return this.mapListKeys(this.db.list(`/users`, ref => ref.orderByChild("username")))
      .map((users: User[]) => {
        return users.filter(user => playersUids.indexOf(user.$key) != -1);
      });
  }

  addAmigo(playerUid: string, amigoUid: string,
    playerAmigosList: string, amigoAmigosList: string): Promise<void> {
    let newPlayerAmigosList: string[] = playerAmigosList.split(" ");
    let newAmigoAmigosList: string[] = amigoAmigosList.split(" ");
    
    newPlayerAmigosList = newPlayerAmigosList.filter(player => {
       return player != " "; 
    });
    newAmigoAmigosList = newAmigoAmigosList.filter(player => {
       return player != " "; 
    });

    newPlayerAmigosList.push(amigoUid);
    newAmigoAmigosList.push(playerUid);

    return this.db.object(`/users/${playerUid}`)
      .update({amigos : newPlayerAmigosList.join(" ")})
      .then(() => {
        this.db.object(`/users/${amigoUid}`)
        .update({amigos : newAmigoAmigosList.join(" ")})
        .catch(this.handlePromiseError);
      })
      .catch(this.handlePromiseError);
  }

  removeAmigo(playerUid: string, amigoUid: string,
  playerAmigosList: string, amigoAmigosList: string): Promise<void> {

    let newPlayerAmigosList: string[] = playerAmigosList.split(" ");
    let newAmigoAmigosList: string[] = amigoAmigosList.split(" ");
    
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
        .catch(this.handlePromiseError);
      })
      .catch(this.handlePromiseError);
  }

  sendSolicitacao(senderUid: string, receiverUid: string): Promise<void> {
    return this.db.list(`/solicitacoes-amizade/${receiverUid}`)
      .push(new SolicitacaoAmizade(senderUid))
      .transaction(() => {}, (a,b,c) => {console.log(a)})
      .catch(this.handlePromiseError);
  }

  deleteSolicitacao(playerUid: string, solicitacaoKey: string): Promise<void> {
    return this.db.object(`/solicitacoes-amizade/${playerUid}/${solicitacaoKey}`)
      .remove()
      .catch(this.handlePromiseError);
  }

  aceitarSolicitacao(solicitacaoKey: string, senderUid: string, receiverUid: string, 
  senderAmigosList: string, receiverAmigosList: string): Promise<void> {
    return this.addAmigo(receiverUid, senderUid, receiverAmigosList, senderAmigosList)
      .then(() => {
        return this.deleteSolicitacao(receiverUid, solicitacaoKey)
          .catch(this.handlePromiseError);
      })
      .catch(this.handlePromiseError);
  }

  getPlayerSolicitacoes(playerUid: string): Observable<SolicitacaoAmizade[]> {
    return this.mapListKeys(this.db.list(`/solicitacoes-amizade/${playerUid}`));
  }

}
