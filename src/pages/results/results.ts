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
  resBicycling: any;
  DrivingValues: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.resWalking = this.navParams.get('resWalking');
    this.resDriving = this.navParams.get('resDriving');
    this.resBicycling = this.navParams.get('resBicycling');
    this.DrivingValues = {
      CO2Emissions: this.calcCO2Emissions('DRIVING', this.resDriving.distance.value),
      cost: this.calcMoneySpent('DRIVING', this.resDriving.distance.value)
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
  }

  calcCO2Emissions(travelMode, distance): any{
    var CO2Emissions;
    if(travelMode == 'DRIVING'){
      var CO2pm = 411; //g of co2 per mile
      //info from https://www.epa.gov/sites/production/files/2016-02/documents/420f14040a.pdf
      var CO2meter = CO2pm/(1.60934*100); // miles to km to meters, g per meter
      var CO2value = distance * CO2meter;
      var CO2text = Math.floor(CO2value) + ' g';
      CO2Emissions = {
        value: CO2value,
        text: CO2text
      }
    }
    return CO2Emissions;
  }

  calcGasoline(distance){
    return distance * 20; // change value
  }

  calcMoneySpent(travelMode, distance): any{
    if(travelMode == 'DRIVING'){
      var mpg = 23.6; //miles per gallon
      var gkm = 1/(mpg*1.60394); //gallon per km
      var priceGallon = 8332; //pesos, from http://www.portafolio.co/economia/precios-de-la-gasolina-para-marzo-de-2017-503706
      var cost = priceGallon * gkm * distance/1000;
      return '$'+ Math.ceil(cost);
    }
    return null;
  }

  calcCaloriesBurn(distance){
    return distance * 20; //change value
  }



}
