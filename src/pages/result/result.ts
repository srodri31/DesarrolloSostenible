import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Result page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})
export class ResultPage {

  result: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.result = navParams.get('result');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
  }

  styleBadge(Emissions){
    if(Emissions == 0){
      return "secondary"
    }else if(Emissions > 0 && Emissions < 5000){
      return "warning";
    }else{
      return "danger";
    }
  }

}
