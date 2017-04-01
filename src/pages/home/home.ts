import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
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
 
  constructor(public navCtrl: NavController) {
    
  }
 
  ionViewDidLoad(){
    this.loadMap();
  }
 
  loadMap(){
 
    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
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

      //Add listener to add markers
      google.maps.event.addListener(this.map, 'click', (event) => {
        this.addMarker(event.latLng);
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
  
    let content = "<h4>Information!</h4>";          
  
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
}