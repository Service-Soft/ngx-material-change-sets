import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeSetsComponent, NGX_CHANGE_SET_SERVICE } from 'ngx-material-change-sets';
import { ChangeSetService } from '../services/change-set.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ChangeSetsComponent,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule
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