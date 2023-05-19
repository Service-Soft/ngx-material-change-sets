/* eslint-disable @cspell/spellchecker */
/* eslint-disable jsdoc/require-jsdoc */
import { Component } from '@angular/core';
import { ChangeSetType } from 'ngx-material-change-sets';
import { TestEntity } from '../models/test-entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    entity: TestEntity = {
        firstName: 'James',
        lastName: 'Smith',
        id: '1',
        changeSets: [
            {
                id: '1',
                type: ChangeSetType.CREATE,
                changeSetEntityId: '1',
                createdAt: new Date(2020, 4, 15, 12, 30),
                createdBy: '42',
                changes: [
                    {
                        id: '1',
                        key: 'firstName',
                        previousValue: undefined,
                        newValue: 'James',
                        changeSetId: '1'
                    },
                    {
                        id: '2',
                        key: 'lastName',
                        previousValue: undefined,
                        newValue: 'Smith',
                        changeSetId: '1'
                    }
                ]
            },
            {
                id: '2',
                type: ChangeSetType.DELETE,
                changeSetEntityId: '1',
                createdAt: new Date(2020, 4, 16, 10, 0),
                createdBy: '20',
                changes: []
            },
            {
                id: '3',
                type: ChangeSetType.UPDATE,
                changeSetEntityId: '1',
                createdAt: new Date(2020, 4, 17, 18, 15),
                createdBy: '20',
                changes: [
                    {
                        id: '3',
                        key: 'firstName',
                        previousValue: 'James',
                        newValue: 'Max',
                        changeSetId: '3'
                    }
                ]
            },
            {
                id: '4',
                type: ChangeSetType.RESTORE,
                changeSetEntityId: '1',
                createdAt: new Date(2020, 4, 18, 6, 25),
                changes: [
                    {
                        id: '4',
                        key: 'lastName',
                        previousValue: 'Smith',
                        newValue: 'Mustermann',
                        changeSetId: '4'
                    }
                ]
            },
            {
                id: '5',
                type: ChangeSetType.RESET,
                changeSetEntityId: '1',
                createdAt: new Date(2020, 4, 19, 17, 42),
                createdBy: 'Really Long Name For Responsiveness',
                changes: [
                    {
                        id: '5',
                        key: 'lastName',
                        previousValue: 'Mustermann',
                        newValue: 'Smith',
                        changeSetId: '5'
                    },
                    {
                        id: '6',
                        key: 'firstName',
                        previousValue: 'Max',
                        newValue: 'James',
                        changeSetId: '5'
                    }
                ]
            },
            {
                id: '6',
                type: ChangeSetType.REPLACE,
                changeSetEntityId: '1',
                createdAt: new Date(2020, 4, 20, 13, 40),
                changes: [
                    {
                        id: '7',
                        key: 'firstName',
                        previousValue: 'James',
                        newValue: 'Really Long Value For Responsiveness',
                        changeSetId: '6'
                    },
                    {
                        id: '7',
                        key: 'lastName',
                        previousValue: 'Smith',
                        newValue: 'Mustermann',
                        changeSetId: '6'
                    }
                ]
            }
        ]
    };
}