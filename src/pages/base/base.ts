import { Loading, AlertController, LoadingController, ToastController } from 'ionic-angular';

export abstract class BasePage {
    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController
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

    protected showToast(mensagem: string){
        let toast = this.toastCtrl.create({
            message: mensagem,
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }

}