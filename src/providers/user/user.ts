import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';

import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { User } from '../../models/user.model';
import { AuthProvider } from '../auth/auth';
import { Status } from '../../models/status.model';
import { UserSettings } from '../../models/user-settings.model';
import { LojaProvider } from '../loja/loja';
import { ItensLojaUsuarios } from '../../models/itens-loja-usuarios.model';



@Injectable()
export class UserProvider extends BaseProvider {

  currentUser: Observable<User>;
  currentUserObject: AngularFireObject<User>;
  userSubscribe: User;
  type: string;

  constructor(
    public db: AngularFireDatabase,
    public http: Http,
    public authService: AuthProvider
  ) {
    super(db);
  }

  create(user: User, uid: string): Promise<void> {
    user = new User(
      user.name,
      user.username,
      user.email,
      "player",
      new Status(0, 85, 0, 0),
      new UserSettings('', '', '')
    );
    return this.db.object(`/users/${uid}`)
      .set(user)
      .then(() => {
        return this.db.object(`inventario/${uid}`)
          .set(new ItensLojaUsuarios("", "purple-theme", "", ""))
          .then(() => {
            return this.updateUserSettings(
              new UserSettings("purple-theme", "", ""),
              uid
            )
            .catch(this.handlePromiseError);
          })
          .catch(this.handlePromiseError);
      })
      .catch(this.handlePromiseError);
  }

  userExists(username: string): Observable<boolean> {
    return this.db.list('/users', ref => ref.orderByChild("username").equalTo(username)
    ).valueChanges()
      .map((users: User[]) => {
        return users.length > 0;
      }).catch(this.handleObservableError);
  }

  getUserById(uid: string) {
    this.currentUserObject = this.db.object(`/users/${uid}`);
    this.currentUserObject.valueChanges().subscribe((user: User) => {
      this.userSubscribe = user;
    });
    this.currentUser = this.currentUserObject.valueChanges();
  }

  editUser(user: User, uid: string): Promise<void> {
    return this.db.object(`/users/${uid}`)
      .update(user)
      .catch(this.handlePromiseError);
  }

  updateStatus(oldStatus: Status, newStatus: Status, uid: string): Promise<void> {
    if(this.getNivel(oldStatus.xp) < this.getNivel(newStatus.xp)){
      newStatus.hp = this.getHPNivel(newStatus.xp);
    }
    return this.db.object(`/users/${uid}/status`).update(newStatus)
      .catch(this.handlePromiseError);
  }

  get isAdmin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.currentUser
        .first()
        .subscribe((user: User) => {
          this.type = user.type;
          if (user.type == "adm") {
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  }

  getNivel(xp: number): number {
    let xpNecessario = 0;
    let nivel = 1;
    while (true) {
      xpNecessario = (50 / 3 * (Math.pow(nivel, 3) - 6 * Math.pow(nivel, 2) + 17 * nivel - 12));
      if (xp == xpNecessario) {
        return nivel;
      } else if (xp < xpNecessario) {
        return nivel - 1;
      } else {
        nivel++;
      }
    }
  }

  getHPNivel(xp: number): number {
    return (this.getNivel(xp) - 8) * 15 + 190;
  }

  getHPPorcentagem(xp: number, hp: number) {
    let porcentagem: number = (hp / this.getHPNivel(xp)) * 100;
    return porcentagem.toFixed(1);
  }

  getXPPorcentagem(xp: number) {
    let nivel: number = this.getNivel(xp)+1;
    let relativeXp = xp - (50 / 3 * (Math.pow((nivel -1 ), 3) - 6 * Math.pow((nivel -1 ), 2) + 17 * (nivel -1 ) - 12));
    let porcentagem = (relativeXp / (50 / 3 * (Math.pow(nivel, 3) - 6 * Math.pow(nivel, 2) + 17 * nivel - 12))) * 100;
    return porcentagem.toFixed(1);
  }

  getUserStatus(uid: string): Observable<Status> {
    return this.db.object<Status>(`users/${uid}/status`).valueChanges();
  }

  getUserSettings(uid: string): Observable<UserSettings> {
    return this.db.object<UserSettings>(`users/${uid}/settings`).valueChanges();
  }

  updateUserSettings(data: any, uid: string): Promise<void> {
    return this.db.object(`users/${uid}/settings`).update(data)
      .catch(this.handlePromiseError);
  }

}