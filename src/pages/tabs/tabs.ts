import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about'

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  private rootPage;
  private homePage;
  private profilePage;
  private aboutPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.rootPage = HomePage;
    this.homePage = HomePage;
    this.profilePage = ContactPage;
    this.aboutPage = AboutPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  openPage(p) {
    this.rootPage = p;
  }

}
