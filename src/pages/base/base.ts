import { Loading, AlertController, LoadingController } from 'ionic-angular';

export abstract class BasePage {
    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController
    ){

    }
    protected showLoading(): Loading {
        let loading: Loading = this.loadingCtrl.create({
            content: "Aguarde..."
        });
        loading.present();
        return loading;
    }

    protected showAlert(message: string) {
        this.alertCtrl.create({
            message: message,
            buttons: ['Ok']
        }).present();
    }

}