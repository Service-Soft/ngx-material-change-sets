import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeSetsComponent, NGX_CHANGE_SET_SERVICE } from 'ngx-material-change-sets';
import { ChangeSetService } from '../services/change-set.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ChangeSetsComponent,
        HttpClientModule
    ],
    providers: [
        {
            provide: NGX_CHANGE_SET_SERVICE,
            useExisting: ChangeSetService
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }