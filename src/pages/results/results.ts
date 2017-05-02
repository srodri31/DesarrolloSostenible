import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

declare var google;
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

  origin: any;
  destination: any;
  resWalking: any;
  resDriving: any;
  resBicycling: any;
  DrivingValues: any;
  //for segment in view
  travelMode: string = "walking";
  isAndroid: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
    
    this.isAndroid = platform.is('android');
    this.origin = this.navParams.get('origin');
    this.destination = this.navParams.get('destination');
    this.resWalking = this.navParams.get('resWalking');
    this.resDriving = this.navParams.get('resDriving');
    this.resBicycling = this.navParams.get('resBicycling');
    this.DrivingValues = {
      CO2Emissions: this.calcCO2Emissions('DRIVING', this.resDriving.distance.value),
      cost: this.calcMoneySpent('DRIVING', this.resDriving.distance.value),
      gas: this.calcGasoline(this.resDriving.distance.value),
      taxiCost: this.calcMoneySpent('TAXI', this.resDriving.distance.value)
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
    var mpg = 23.6; //miles per gallon
    var gkm = 1/mpg/1.60394; //gallon per km
    var totalgkm = distance/1000 * gkm;
    return totalgkm.toFixed(2) + ' gallons'; 
  }

  calcMoneySpent(travelMode, distance): any{
    if(travelMode == 'DRIVING'){
      var mpg = 23.6; //miles per gallon
      var gkm = 1/mpg/1.60394; //gallon per km
      var priceGallon = 8332; //pesos, from http://www.portafolio.co/economia/precios-de-la-gasolina-para-marzo-de-2017-503706
      var cost = priceGallon * (gkm * distance/1000);
      return '$'+ Math.ceil(cost);
    }else if(travelMode == 'TAXI'){
      var minimun = 5000; //from https://www.medellin.gov.co/movilidad/transito-transporte/taxis
      var price78m = 87; //price every 78 meters
      var startPrice = 3000;
      var cost = (distance * price78m/78) + startPrice;
      if(cost < minimun){
        cost = minimun;
      }
      return '$' + Math.ceil(cost);

    }
    return null;
  }

  calcCaloriesBurn(distance){
    return distance * 20; //change value
  }

  changeSegment(travelModel){
    this.travelMode = travelModel;
  }

}
