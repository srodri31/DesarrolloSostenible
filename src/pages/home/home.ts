import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { ResultsPage } from '../results/results';

declare var google;
 
@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class HomePage {
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //label for the marker
  labelIndex = 0;
  origin: any;
  destination: any;
  directionsDisplay: any;
 
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    
  }
 
  ionViewDidLoad(){
    this.loadMap();
  }
 
  loadMap(){
 
    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.origin = latLng;
      var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
      };

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      let mapEle = document.getElementById('map');
      this.map = new google.maps.Map(mapEle, mapOptions);
      var infoWindow = new google.maps.InfoWindow({map: this.map});
      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here');

      //Add renderer to draw route
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsDisplay.setMap(this.map);
      //Add listener to add markers
      google.maps.event.addListener(this.map, 'click', (event) => {
        this.addMarker(event.latLng);
        this.confirmationAlert();
        this.destination = event.latLng;
      });

    }, (err) => {
      console.log(err);
    });
 
  }

  addMarker(location){
 
    let marker = new google.maps.Marker({
      map: this.map,
      label: this.labels[this.labelIndex++ % this.labels.length],
      animation: google.maps.Animation.DROP,
      position: location

    });
  
    let content = "Information!";          
  
    this.addInfoWindow(marker, content);
  
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  
  }

  goTo(){
    if(this.destination){
      console.log('Distance matrix');
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [this.origin],
          destinations: [this.destination],
          travelMode: google.maps.TravelMode.WALKING,
          avoidHighways: false,
          avoidTolls: false,
        }, (response1, status1) => {
          console.log('Results part 1');
          service.getDistanceMatrix(
          {
            origins: [this.origin],
            destinations: [this.destination],
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false,
          }, (response2, status2) => {
            console.log('Results part 2');
            this.parcingDistanceResults(response1, response2, status1, status2);
          });
        });
    }else{
      this.showAlert('First you have to mark a destination','Warning');
    }
  }

  parcingDistanceResults(response1, response2, status1, status2){
    if (status1 == google.maps.DistanceMatrixStatus.OK) {
      var origins = response1.originAddresses;
      var destinations = response1.destinationAddresses;
      var res1, res2, res3;

      for (var i = 0; i < origins.length; i++) {
        var results = response1.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var distanceValue = element.distance.value;
          var duration = element.duration.text;
          console.log('Walking: Distance:'+distance+' Duration: '+duration);
          var len = distance.length;
          //distance = distance.substring(0, len-3);
          res1 = {
            distance: distance,
            duration: duration
          }
          
          res3 = {
            distance: distance,
            duration: this.calcDurationRideBicycle(distanceValue)
          }

          console.log('Driving: Distance:'+distance+' Duration: '+this.calcDurationRideBicycle(distanceValue));

        }
      }

      for (var i = 0; i < origins.length; i++) {
        var results = response2.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          console.log('Driving: Distance:'+distance+' Duration: '+duration);
          var len = distance.length;
          //distance = distance.substring(0, len-3);
          res2 = {
            distance: distance,
            duration: duration
          }
          
        }
      }

          this.navCtrl.push(ResultsPage, {
              resWalking: res1,
              resDriving: res2,
              resBicycling: res3
          })
    }

  }

  calcDurationRideBicycle(distance): any{
    var durationText = '';
    var speed = 13; //average speed in km/h
    //duration in meters
    var duration = distance/(speed*1000); //convert km to m
    if(duration >= 60){
      console.log('duration in bike is greater than 1 h');
      var hours = Math.floor(duration);
      durationText = hours + ' h ';
      duration = duration - hours;
    }
    duration = duration * 60; //convert h to min
    var min = Math.floor(duration);
    durationText = durationText + min + ' min';
    return durationText;
  }

  calcRoute(travelMode){
    var directionsService = new google.maps.DirectionsService();
    var request = {
    origin: this.origin,
    destination: this.destination,
    travelMode: travelMode
    };
    directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        this.directionsDisplay.setDirections(result);
      }
    });

  }

  showAlert(message,title) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  } 

  confirmationAlert(){
    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Do you you want to go here?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
            this.goTo();
            //resDriving = this.goTo(google.maps.TravelMode.DRIVING);
            /*this.navCtrl.push(ResultsPage, {
              resWalking: this.goTo(google.maps.TravelMode.WALKING),
              resDriving: this.goTo(google.maps.TravelMode.DRIVING)
            })*/
            //this.selectKindTransport();
          }
        }
      ]
    });
    confirm.present();
  }
  

  selectKindTransport() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choose one');

    var walk = {type: 'radio', label: 'walking', value: google.maps.TravelMode.WALKING, checked: true};
    var drive = {type: 'radio', label: 'driving', value: google.maps.TravelMode.DRIVING};
    var bicycle = {type: 'radio', label: 'bicycling', value: google.maps.TravelMode.WALKING};

    alert.addInput(walk);
    alert.addInput(drive);
    alert.addInput(bicycle);

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        //this.goTo(data);
        //this.calcRoute(data);
      }
    });
    alert.present();
  }
}
