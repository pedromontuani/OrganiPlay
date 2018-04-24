import { OnInit } from '@angular/core';
import { NavController, AlertController, App, MenuController } from 'ionic-angular';

import { LoginPage } from './../pages/login/login';

export abstract class BaseComponent implements OnInit {
    
    protected navCtrl: NavController;

    constructor (
        public alertCtrl: AlertController,
        public app: App,
        public menuCtrl: MenuController

    ) {}

    ngOnInit(): void {
        this.navCtrl = this.app.getActiveNav();
    }

    onLogout(): void {
       this.navCtrl.setRoot(LoginPage);
    }
}