import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { UserProvider } from '../../../providers/user/user';
import { AdminProvider } from '../../../providers/admin/admin';
import { AdmEditarUsuarioPage } from '../../adm-editar-usuario/adm-editar-usuario';
import { NovaPocaoPage } from '../nova-pocao/nova-pocao';
import { NovoAvatarPage } from '../novo-avatar/novo-avatar';
import { NovoWallpaperPage } from '../novo-wallpaper/novo-wallpaper';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  users;
  mundos: Observable<User>;
  view: string = "users";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public userProvider: UserProvider,
    public adminProvider: AdminProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform
  ) {
    menuCtrl.enable(true, "menu-admin");
  }

  ionViewCanEnter(): boolean {
    return this.userProvider.type == "adm";
  }

  ionViewWillLoad() {
    this.users = this.adminProvider.usersList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  onUserClick(user: User) {
    console.log(user);
    this.navCtrl.push(AdmEditarUsuarioPage, { uid: user.$key });
  }

  addUsuario() {
    console.log("Usuario");
  }

  addMundo() {
    console.log("Mundo");
  }

  addItemLoja() {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Nova poção',
          icon: !this.platform.is('ios') ? 'flask' : null,
          handler: () => {
            this.navCtrl.push(NovaPocaoPage);
          }
        },
        {
          text: 'Novo avatar',
          icon: !this.platform.is('ios') ? 'body' : null,
          handler: () => {
            this.navCtrl.push(NovoAvatarPage);
          }
        },
        {
          text: 'Novo papel de parede',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.navCtrl.push(NovoWallpaperPage);
          }
        }
      ]
    }).present();
  }

  filterItens(event: any) {
    let searchTerm: string = event.target.value;

    if (searchTerm) {
      switch (this.view) {
        case "mundos":
          // this.chats = this.chats.map((chats: Chat[])=>{
          //    return chats.filter((chat: Chat)=>{
          //     return (chat.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          //   });
          //  });
          break;
        case "users":
          this.users = this.users.map((users: User[]) => {
            return users.filter((user: User) => {
              return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
            });
          });
          break;
      }
    } else {
      this.users = this.adminProvider.usersList;
    }
  }


}
