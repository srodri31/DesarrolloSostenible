import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, Content, ViewController, FabContainer } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { ResultsPage } from '../results/results';
import { SuggestionPage } from '../suggestion/suggestion';

declare var google;
 
@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class HomePage {
 
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(Content) content: Content;
  map: any;
  labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //label for the marker
  labelIndex = 0;
  origin: any;
  destination: any;
  directionsDisplay: any;
  
  //autocomplete
  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;
 
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public viewCtrl: ViewController) {
      this.acService = new google.maps.places.AutocompleteService();
      this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };    
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

      var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener('bounds_changed', () => {
          searchBox.setBounds(this.map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', () => {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach((marker) => {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            this.addMarker(place.geometry.location);
            this.destination = place.geometry.location;

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          this.map.fitBounds(bounds);
        });


      //Add renderer to draw route
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsDisplay.setMap(this.map);
      //Add listener to add markers
      google.maps.event.addListener(this.map, 'click', (event) => {
        this.addMarker(event.latLng);
        this.selectOption();
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
  
    //Add event to marker
    google.maps.event.addListener(marker, 'click', () => {
      this.selectOption();
    });

    //let content = "<button type=\"button\" onclick=\"goTo()\">Click Me!</button>";          
  
    //this.addInfoWindow(marker, content);
  
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  
  }

  //to calculate distance and duration
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
          var distance = element.distance;
          var duration = element.duration;
          console.log('Walking: Distance:'+distance.text+' Duration: '+duration);
          var len = distance.length;
          //distance = distance.substring(0, len-3);
          res1 = {
            distance: distance,
            duration: duration
          }
          
          res3 = {
            distance: distance,
            duration: this.calcDurationRideBicycle(distance.value)
          }

          console.log('Driving: Distance:'+distance.text);

        }
      }

      for (var i = 0; i < origins.length; i++) {
        var results = response2.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance;
          var duration = element.duration;
          console.log('Driving: Distance:'+distance.text+' Duration: '+duration);
          var len = distance.length;
          //distance = distance.substring(0, len-3);
          res2 = {
            distance: distance,
            duration: duration
          }
          
        }
      }

          this.navCtrl.push(SuggestionPage, {
              resWalking: res1,
              resDriving: res2,
              resBicycling: res3,
              origin: this.origin,
              destination: this.destination
          })
    }

  }

  calcDurationRideBicycle(distance): any{
    var duration;
    var durationText = '';
    var speed = 13; //average speed in km/h
    //duration in meters
    var durationV = distance/(speed*1000); //convert km to m
    var value = durationV*60*60;
    if(durationV >= 60){
      console.log('duration in bike is greater than 1 h');
      var hours = Math.floor(durationV);
      durationText = hours + ' h ';
      durationV = durationV - hours;
    }
    durationV = durationV * 60; //convert h to min
    var min = Math.floor(durationV);
    durationText = durationText + min + ' min';
    duration = {
      value: value,
      text: durationText
    }
    return duration;
  }

  //to show route on map
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

  selectOption() {
    let alert = this.alertCtrl.create();
    alert.setTitle('What do you want to do?');

    var info = {type: 'radio', label: 'See info', value: 'info', checked: true};
    var route = {type: 'radio', label: 'See route', value: 'route'};

    alert.addInput(info);
    alert.addInput(route);

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        switch(data){
          case 'info':
            this.goTo();
            break;
          case 'route':
            this.calcRoute(google.maps.TravelMode.WALKING);
            break;
        }
      }
    });
    alert.present();
  }

  seeRoute(TravelMode, fab: FabContainer){
    if(this.destination){
      switch(TravelMode){
        case 'walk':
          this.calcRoute(google.maps.TravelMode.WALKING);
          break;
        case 'bicycle':
          this.calcRoute(google.maps.TravelMode.WALKING);
          break;
        case 'car':
          this.calcRoute(google.maps.TravelMode.DRIVING);
          break;
        case 'bus':
          this.calcRoute(google.maps.TravelMode.TRANSIT);
          break;
      }
    }else{
      this.showAlert('First you have to mark a destination','Warning');
    }
    fab.close();
  }

  update(){
      this.content.resize();
      //location.reload();
  }
}
