import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { HabitosPage } from '../pages/habitos/habitos';
import { AfazeresPage } from '../pages/afazeres/afazeres';
import { RecompensasPage } from '../pages/recompensas/recompensas';
import { TabsPage } from '../pages/tabs/tabs';
import { AdminPage } from '../pages/admin/admin';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { CadastrarPage } from '../pages/cadastrar/cadastrar';
import { CustomHeaderComponent } from '../components/custom-header/custom-header';
import { UserInfoComponent } from '../components/user-info/user-info';
import { UserMenuComponent } from '../components/user-menu/user-menu';
import { AdminHeaderComponent } from '../components/admin-header/admin-header';
import { AdminProvider } from '../providers/admin/admin';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MenuAdminComponent } from '../components/menu-admin/menu-admin';
import { AdmEditarUsuarioPage } from '../pages/adm-editar-usuario/adm-editar-usuario';
import { UserStatusComponent } from '../components/user-status/user-status';
import { NovaRecompensaPage } from '../pages/nova-recompensa/nova-recompensa';
import { NovoAfazerPage } from '../pages/novo-afazer/novo-afazer';
import { NovoHabitoPage } from '../pages/novo-habito/novo-habito';
import { EditarPerfilPage } from '../pages/editar-perfil/editar-perfil';
import { HabitosProvider } from '../providers/habitos/habitos';
import { AfazeresProvider } from '../providers/afazeres/afazeres';
import { RecompensasProvider } from '../providers/recompensas/recompensas';
import { MundosProvider } from '../providers/mundos/mundos';
import { MundosPage } from '../pages/mundos/mundos';
import { NovoMundoPage } from '../pages/GameMaster/novo-mundo/novo-mundo';
import { NovoMundoUsuariosPage } from '../pages/GameMaster/novo-mundo-usuarios/novo-mundo-usuarios';
import { GerenciarMundoPage } from '../pages/GameMaster/gerenciar-mundo/gerenciar-mundo';
import { NovaTarefaMundoPage } from '../pages/GameMaster/nova-tarefa-mundo/nova-tarefa-mundo';
import { AcessarMundoPage } from '../pages/acessar-mundo/acessar-mundo';
import { GerenciarTarefaPage } from '../pages/GameMaster/gerenciar-tarefa/gerenciar-tarefa';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyA6IDVOXo4HoYvTx_JYSPI7xOZisI9c6gQ",
  authDomain: "organiplay.firebaseapp.com",
  databaseURL: "https://organiplay.firebaseio.com",
  storageBucket: "organiplay.appspot.com",
  messagingSenderId: "805916840528"
};

@NgModule({
  declarations: [
    MyApp,
    HabitosPage,
    AdminPage,
    MenuAdminComponent,
    AdminHeaderComponent,
    TabsPage,
    LoginPage,
    CadastrarPage,
    CustomHeaderComponent,
    UserInfoComponent,
    UserMenuComponent,
    AfazeresPage,
    RecompensasPage,
    AdmEditarUsuarioPage,
    UserStatusComponent,
    NovaRecompensaPage,
    NovoAfazerPage,
    NovoHabitoPage,
    EditarPerfilPage,
    MundosPage,
    NovoMundoPage,
    NovoMundoUsuariosPage,
    GerenciarMundoPage,
    NovaTarefaMundoPage,
    AcessarMundoPage,
    GerenciarTarefaPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AdminPage,
    HabitosPage,
    TabsPage,
    LoginPage,
    CadastrarPage,
    AfazeresPage,
    RecompensasPage,
    AdmEditarUsuarioPage,
    NovaRecompensaPage,
    NovoAfazerPage,
    NovoHabitoPage,
    EditarPerfilPage,
    MundosPage,
    NovoMundoPage,
    NovoMundoUsuariosPage,
    GerenciarMundoPage,
    NovaTarefaMundoPage,
    AcessarMundoPage,
    GerenciarTarefaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AdminProvider,
    AuthProvider,
    UserProvider,
    HabitosProvider,
    AfazeresProvider,
    RecompensasProvider,
    MundosProvider,
    AndroidPermissions,
    ImagePicker,
    PhotoViewer,
    Camera
  ]
})
export class AppModule {}
