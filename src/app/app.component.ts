import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Analytics, logEvent, } from '@angular/fire/analytics';
import { deleteToken, getToken, Messaging } from '@angular/fire/messaging';
import { Performance, traceUntilFirst } from '@angular/fire/performance';
import { fetchAndActivate, getString, RemoteConfig } from '@angular/fire/remote-config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loading = false;
  public enabled = false;
  public greeting = '';
  public notificationPermission = this.document?.defaultView?.Notification?.permission;
  public deferredPrompt: BeforeInstallPromptEvent | null = null;

  constructor(
    @Optional() private analytics: Analytics,
    @Optional() private messaging: Messaging,
    @Optional() private remoteConfig: RemoteConfig,
    @Inject(DOCUMENT) private document: Document,
    private injector: Injector,
    private router: Router,
    private swUpdate: SwUpdate,
    public swPush: SwPush,
  ) { }

  ngOnInit(): void {
    // Initialize the Firebase Performance
    this.injector.get(Performance);
    // Fetch the Firebase Remote Config values
    if (this.remoteConfig) {
      fetchAndActivate(this.remoteConfig).then(() => {
        this.greeting = getString(this.remoteConfig, 'greeting');
      });
    }
    // Close all notifications on page load
    this.document?.defaultView?.navigator?.serviceWorker?.getRegistration().then((registration) => {
      if (registration) {
        registration.getNotifications().then((notifications) => {
          for (let notification of notifications) {
            notification.close();
          }
        });
      }
    });
    // Listen to navigation events to show/hide the loading indicator
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
    // Update the app when a new version is available
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(traceUntilFirst('versionUpdates')).subscribe((event) => {
        if (event.type === 'VERSION_READY') {
          console.log(`New app version available: ${event.latestVersion.hash}`);
          if (confirm(`New app version available. Would you like to load it right now?`)) {
            this.logEvent('app_update_confirmation', event);
            this.document?.defaultView?.location.reload();
          } else {
            this.logEvent('app_update_dismiss', event);
          }
        }
      });
    }
    // Listen to push notifications
    if (this.swPush.isEnabled) {
      this.swPush.messages.subscribe((message) => {
        this.logEvent('notification_receive', message);
        console.log('Notification receive', message);
      });
      this.swPush.notificationClicks.subscribe((message) => {
        this.logEvent('notification_open', message);
        console.log('Notification open', message);
      });
    }
    // Listen to PWA installation event
    this.document?.defaultView?.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.logEvent('installation_available');
    });
  }

  // Log an event to the Firebase Analytics
  logEvent(eventName: string, eventParams?: { [key: string]: any; }): void {
    if (this.analytics) {
      logEvent(this.analytics, eventName, eventParams);
    }
  }

  // Subscribe to push notifications and get FCM token
  enableNotifications(): void {
    this.swPush.requestSubscription({
      serverPublicKey: environment.vapidKey
    }).then(subscription => {
      this.logEvent('notifications_subscription');
      console.log('Notifications subscription', subscription);
      return navigator.serviceWorker.getRegistration();
    }).then((registration) => {
      return getToken(this.messaging, {
        vapidKey: environment.vapidKey,
        serviceWorkerRegistration: registration
      })
    }).then((token) => {
      console.log('Notifications token', token);
    }).catch(error => {
      console.error('Could not subscribe to notifications', error);
    });
  }

  // Unsubscribe from push notifications and delete FCM token
  disableNotifications(): void {
    this.swPush.unsubscribe().then(() => {
      this.logEvent('notifications_unsubscription');
      console.log('Notifications unsubscription');
      return deleteToken(this.messaging);
    }).then((response) => {
      console.log('Notifications token deleted', response);
    }).catch(error => {
      console.error('Could not unsubscribe from notifications', error);
    });
  }

  // Install PWA
  installApp(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((userChoice) => {
        if (userChoice.outcome === 'accepted') {
          this.logEvent('installation_complete');
        } else {
          this.logEvent('installation_dismiss');
        }
        this.deferredPrompt = null;
      });
    }
  }
}
