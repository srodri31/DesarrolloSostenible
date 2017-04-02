import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

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

      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsDisplay.setMap(this.map);
      //Add listener to add markers
      google.maps.event.addListener(this.map, 'click', (event) => {
        this.addMarker(event.latLng);
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

  goTo(travelMode){
    if(this.destination){
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [this.origin],
          destinations: [this.destination],
          travelMode: travelMode,
          avoidHighways: false,
          avoidTolls: false,
        }, (response, status) => {
          this.parcingDistanceResults(response, status);
        });
    }else{
      this.showAlert('First you have to mark a destination');
    }
  }

  parcingDistanceResults(response, status){
    if (status == google.maps.DistanceMatrixStatus.OK) {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;

      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          console.log('Distance:'+distance+' Duration: '+duration);
        }
      }
    }

  }

  calcDurationRideBicycle(distance): any{
    var speed = 16.89; //average speed in km
    var duration = distance/speed;
    return duration;
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

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
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
        this.goTo(data);
        this.calcRoute(data);
      }
    });
    alert.present();
  }
}
