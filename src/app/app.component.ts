import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthData } from '../providers/auth-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  zone : NgZone;

  constructor(authData: AuthData, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.rootPage = TabsPage;
    platform.ready().then(() => {
      /*this.zone = new NgZone({});
      const unsubscribe = authData.fireAuth.onAuthStateChanged((user) => {
        this.zone.run( () => {
          if (!user) {
            this.rootPage = LoginPage;
            unsubscribe();
          } else { 
            this.rootPage = TabsPage; 
            unsubscribe();
          }
        });     
      });*/
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
    
  }
}

