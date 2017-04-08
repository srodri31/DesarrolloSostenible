import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Results page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})
export class ResultsPage {

  resWalking: any;
  resDriving: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.resWalking = this.navParams.get('resWalking');
    //this.resDriving = this.navParams.get('resDriving');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
  }

}
