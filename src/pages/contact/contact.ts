import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthData } from '../../providers/auth-data'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public user: any;

  constructor(public navCtrl: NavController, public authData: AuthData) {
    this.user = authData.user;
  }

}
