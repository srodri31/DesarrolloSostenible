import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

@Injectable()
export class AuthData {
  // Here we declare the variables we'll be using.
  public fireAuth: any;
  public userProfile: any;
  public user: any;

  constructor(public http: Http) {
    var config = {
          apiKey: "AIzaSyD7xzzi9vgpCeZwfyISUteA41ZfTdM32HE",
          authDomain: "huelladecarbono-b4e42.firebaseapp.com",
          databaseURL: "https://huelladecarbono-b4e42.firebaseio.com",
          storageBucket: "huelladecarbono-b4e42.appspot.com",
          messagingSenderId: "933007244657"
      };
    firebase.initializeApp(config);
    this.fireAuth = firebase.auth();
    firebase.auth().onAuthStateChanged((user) => {
        this.user = user;
    });
    this.userProfile = firebase.database().ref('/userProfile');
    
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): firebase.Promise<any> {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
        .then((newUser) => {
        this.userProfile.child(newUser.uid).set({email: email});
        });
    }

    resetPassword(email: string): firebase.Promise<any> {
        return this.fireAuth.sendPasswordResetEmail(email);
    }

    logoutUser(): firebase.Promise<any> {
        return this.fireAuth.signOut();
    }

}
