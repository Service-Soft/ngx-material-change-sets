/* eslint-disable no-console */
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NGX_CHANGE_SET_SERVICE } from 'ngx-material-change-sets';

import { AppComponent } from './app/app.component';
import { ChangeSetService } from './services/change-set.service';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAnimations(),
        {
            provide: NGX_CHANGE_SET_SERVICE,
            useExisting: ChangeSetService
        }
    ]
// eslint-disable-next-line promise/prefer-await-to-callbacks
}).catch(error => console.error(error));