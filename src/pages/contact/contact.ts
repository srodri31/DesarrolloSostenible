import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthData } from '../../providers/auth-data';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public user: any;

  constructor(public navCtrl: NavController, public authData: AuthData) {
    //this.user = authData.user;
  }

  logOut(){
    this.authData.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
