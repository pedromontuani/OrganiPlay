import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HabitosPage } from '../pages/habitos/habitos';
import { AfazeresPage } from '../pages/afazeres/afazeres';
import { RecompensasPage } from '../pages/recompensas/recompensas';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { CadastrarPage } from '../pages/cadastrar/cadastrar';
import { CustomHeaderComponent } from '../components/custom-header/custom-header';
import { UserInfoComponent } from '../components/user-info/user-info';
import { UserMenuComponent } from '../components/user-menu/user-menu';

@NgModule({
  declarations: [
    MyApp,
    HabitosPage,
    TabsPage,
    LoginPage,
    CadastrarPage,
    CustomHeaderComponent,
    UserInfoComponent,
    UserMenuComponent,
    AfazeresPage,
    RecompensasPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HabitosPage,
    TabsPage,
    LoginPage,
    CadastrarPage,
    AfazeresPage,
    RecompensasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
