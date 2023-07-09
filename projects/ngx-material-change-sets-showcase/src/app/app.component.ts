/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeSetsConfig } from 'ngx-material-change-sets';
import { firstValueFrom } from 'rxjs';
import { TestEntity } from '../models/test-entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    readonly testBaseUrl: string = 'http://localhost:3000/test';

    entity!: TestEntity;

    config: Partial<ChangeSetsConfig> = {
        rollbackToChangeSetLabel: 'Custom Rollback to this state'
    };

    constructor(private readonly http: HttpClient) {}

    async ngOnInit(): Promise<void> {
        await new Promise(res => setTimeout(res, 1000));
        this.entity = (await firstValueFrom(this.http.get<TestEntity[]>(this.testBaseUrl)))[0];
    }

    addListItem(value: string): void {
        if (!this.entity.listItems) {
            this.entity.listItems = [];
        }
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