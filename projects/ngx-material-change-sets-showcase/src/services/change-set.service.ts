/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseChangeSetService, ChangeSet } from 'ngx-material-change-sets';

@Injectable({ providedIn: 'root' })
export class ChangeSetService extends BaseChangeSetService {
    protected override displayValueForEmptyCreatedBy: boolean = true;

    constructor(http: HttpClient) {
        super(http);
    }

    override async getDisplayValueForCreatedBy(changeSet: ChangeSet): Promise<string> {
        await new Promise(res => setTimeout(res, 1000));
        return changeSet.createdBy ?? 'System';
    }

    override async openCreatedBy(changeSet: ChangeSet): Promise<void> {
        alert(await this.getDisplayValueForCreatedBy(changeSet));
    }
}