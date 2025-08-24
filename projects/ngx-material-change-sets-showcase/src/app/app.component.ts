
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangeSetsComponent, ChangeSetsConfig } from 'ngx-material-change-sets';
import { firstValueFrom } from 'rxjs';

import { TestEntity } from '../models/test-entity.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        ChangeSetsComponent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule
    ]
})
export class AppComponent implements OnInit {

    readonly testBaseUrl: string = 'http://localhost:3000/test';

    entity!: TestEntity;

    config: Partial<ChangeSetsConfig> = {
        rollbackToChangeSetLabel: 'Custom Rollback to this state'
    };

    constructor(private readonly http: HttpClient) {}

    ngOnInit(): void {
        // eslint-disable-next-line promise/prefer-await-to-then
        void new Promise(resolve => setTimeout(resolve, 1000)).then(async () => {
            this.entity = (await firstValueFrom(this.http.get<TestEntity[]>(this.testBaseUrl)))[0];
        });
    }

    addListItem(value: string): void {
        this.entity.listItems ??= [];
        this.entity.listItems.push(value);
    }

    removeListItem(value: string): void {
        this.entity.listItems?.splice(this.entity.listItems.indexOf(value), 1);
    }

    async updateEntity(): Promise<void> {
        const body: Omit<TestEntity, 'id' | 'changeSets'> = {
            address: this.entity.address,
            birthDay: this.entity.birthDay,
            firstName: this.entity.firstName,
            lastName: this.entity.lastName,
            listItems: this.entity.listItems
        };
        await firstValueFrom(this.http.patch<void>(`${this.testBaseUrl}/${this.entity.id}`, body));
        this.entity = (await firstValueFrom(this.http.get<TestEntity[]>(this.testBaseUrl)))[0];
    }
}