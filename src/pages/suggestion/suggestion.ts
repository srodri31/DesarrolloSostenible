import { Component, ViewChild } from '@angular/core';
import { ResultPage } from '../result/result';
import { NavController, NavParams, AlertController, FabContainer } from 'ionic-angular';
import { Content } from 'ionic-angular';

/*
  Generated class for the Suggestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-suggestion',
  templateUrl: 'suggestion.html'
})
export class SuggestionPage {

  @ViewChild(Content) content: Content;

  origin: any;
  destination: any;
  resWalking: any;
  resDriving: any;
  resBicycling: any;
  DrivingValues: any;
  TaxiValues: any;
  WalkingValues: any;
  BicyclingValues: any;
  suggestionTitle: string = 'Less emissions';

  //for segment in view
  travelMode: string = "walking";
  results = [];
  showCost: boolean = false;
  showCO2: boolean = true;
  showDuration: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController) {
    
    this.origin = this.navParams.get('origin');
    this.destination = this.navParams.get('destination');
    this.resWalking = this.navParams.get('resWalking');
    this.resDriving = this.navParams.get('resDriving');
    this.resBicycling = this.navParams.get('resBicycling');
    this.DrivingValues = {
      name: "Driving",
      img: "https://img02.olx.in/images_olxin/314342339_1_144x108_part-time-drivers-available-for1000-per-day-hyderabad_rev002.jpg",
      distance: this.resDriving.distance.text,
      duration: this.resDriving.duration,
      CO2Emissions: this.calcCO2Emissions('DRIVING', this.resDriving.distance.value),
      cost: this.calcMoneySpent('DRIVING', this.resDriving.distance.value),
      gas: this.calcGasoline(this.resDriving.distance.value),
    };
    this.TaxiValues = {
      name: "Taxi",
      img: "http://www.zappwildlife.com/wp-content/uploads/2015/08/home_taxi_gallery3-195x146.jpg",
      distance: this.resDriving.distance.text,
      duration: this.resDriving.duration,
      CO2Emissions: this.calcCO2Emissions('DRIVING', this.resDriving.distance.value),
      cost: this.calcMoneySpent('TAXI', this.resDriving.distance.value),
    };
    this.WalkingValues = {
      name: "Walking",
      img: "http://www.active.com/Assets/Running/460/Walking-to-Improve-Running.jpg",
      distance: this.resWalking.distance.text,
      duration: this.resWalking.duration,
      CO2Emissions: {
        value: 0,
        text: "0 g "
      },
      cost: {
        text: "$0",
        value: 0
      }
    };
    this.BicyclingValues = {
      name: "Bicycling",
      img: "http://img.aws.livestrongcdn.com/ls-article-image-400/cme/cme_public_images/www_livestrong_com/photos.demandstudios.com/getty/article/225/154/450744969_XS.jpg",
      distance: this.resBicycling.distance.text,
      duration: this.resBicycling.duration,
      CO2Emissions: {
        value: 0,
        text: "0 g "
      },
      cost: {
        text: "$0",
        value: 0
      }
    };

    this.results.push(this.BicyclingValues);
    this.results.push(this.WalkingValues);
    this.results.push(this.DrivingValues);
    this.results.push(this.TaxiValues);
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
      var CO2text;
      if(CO2value > 1000){
        var value = CO2value/1000;
        CO2text = value.toFixed(2) + ' kg ';
      }else{
        CO2text = Math.floor(CO2value) + ' g ';
      }
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
    var cost;
    if(travelMode == 'DRIVING'){
      var mpg = 23.6; //miles per gallon
      var gkm = 1/mpg/1.60394; //gallon per km
      var priceGallon = 8332; //pesos, from http://www.portafolio.co/economia/precios-de-la-gasolina-para-marzo-de-2017-503706
      var value = priceGallon * (gkm * distance/1000);
      var text = '$'+ Math.ceil(value);
      cost = {
        value: value,
        text: text
      };
      return cost;
    }else if(travelMode == 'TAXI'){
      var minimun = 5000; //from https://www.medellin.gov.co/movilidad/transito-transporte/taxis
      var price78m = 87; //price every 78 meters
      var startPrice = 3000;
      var value = (distance * price78m/78) + startPrice;
      if(value < minimun){
        value = minimun;
      }
      var text = '$'+ Math.ceil(value);
      cost = {
        value: value,
        text: text
      };
      return cost;

    }
    return null;
  }

  calcCaloriesBurn(distance){
    return distance * 20; //change value
  }

  changeSegment(travelModel){
    this.travelMode = travelModel;
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

  seeMore(result){
    this.navCtrl.push(ResultPage, {
      result: result
    });
  }

  orderBy(Criteria: string, fab: FabContainer){
    //this.results = [];
    this.content.resize();
    switch(Criteria){
      case 'CO2':
        this.suggestionTitle = 'Less emissions';
        this.results.sort((n1,n2)=> {
          if (n1.CO2Emissions.value > n2.CO2Emissions.value) {
            return 1;
          }
          if (n1.CO2Emissions.value < n2.CO2Emissions.value) {
            return -1;
          }
          return 0;
        });
        this.onlyCO2();
        break;
      case 'duration':
         this.suggestionTitle = 'Less time';
         this.results.sort((n1,n2)=> {
          if (n1.duration.value > n2.duration.value) {
            return 1;
          }
          if (n1.duration.value < n2.duration.value) {
            return -1;
          }
          return 0;
        });
        this.onlyDuration();
        break;
      case 'cost':
        this.suggestionTitle = 'Less cost';
        this.results.sort((n1,n2)=> {
          if (n1.cost.value > n2.cost.value) {
            return 1;
          }
          if (n1.cost.value < n2.cost.value) {
            return -1;
          }
          return 0;
        });
        this.onlyCost();
        break;
    }
    this.content.resize();
    fab.close();
    this.showAlert('The suggestions have been reordered!','Suggestions');
  }

  onlyDuration(){
    this.showCost = false;
    this.showCO2 = false;
    this.showDuration = true;
  }

  onlyCO2(){
    this.showCost = false;
    this.showCO2 = true;
    this.showDuration = false;
  }

  onlyCost(){
    this.showCost = true;
    this.showCO2 = false;
    this.showDuration = false;
  }

  showAlert(message,title) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  } 

  
}
