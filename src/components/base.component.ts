import { App, AlertController, MenuController, NavController } from 'ionic-angular';

;
import { LoginPage } from './../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';

export abstract class BaseComponent {

    protected navCtrl: NavController;

    constructor(
        public alertCtrl: AlertController,
        public authProvider: AuthProvider,
        public app: App,
        public menuCtrl: MenuController
    ) {}

    onLogout(): void {
        this.navCtrl = this.app.getActiveNavs()[0];
        this.alertCtrl.create({
            message: 'Deseja sair?',
            buttons: [
                {
                    text: 'Sim',
                    handler: () => {
                        this.authProvider.logout()
                            .then(() => {
                                this.navCtrl.setRoot(LoginPage);
                                this.menuCtrl.enable(false, 'user-menu');
                            });
                    }
                },
                {
                    text: 'Não'
                }
            ]
        }).present();
    }

}