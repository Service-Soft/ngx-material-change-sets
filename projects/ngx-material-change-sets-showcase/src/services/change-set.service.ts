/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseChangeSetService, ChangeSet } from 'ngx-material-change-sets';

@Injectable({ providedIn: 'root' })
export class ChangeSetService extends BaseChangeSetService {
    constructor(http: HttpClient) {
        super(http);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override async openCreatedBy(changeSet: ChangeSet): Promise<void> {
        //TODO
    }
}