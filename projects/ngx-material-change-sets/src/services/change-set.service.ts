import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ChangeSetsConfig as ChangeSetsConfiguration, ConfirmDialogData } from '../components/change-sets/change-sets-config.model';
import { ChangeSet, ChangeSetEntity } from '../models';

// eslint-disable-next-line @typescript-eslint/typedef
export const NGX_CHANGE_SET_SERVICE = new InjectionToken<BaseChangeSetService>(
    'Provide for the change set service used eg. to rollback changes or generate a link to the user that created a change.',
    {
        providedIn: 'root',
        factory: (() => {
            // eslint-disable-next-line no-console
            console.error(
                // eslint-disable-next-line max-len
                'No ChangeSetService has been provided for the token NGX_CHANGE_SET_SERVICE\nAdd this to your app.module.ts provider array:\n{\n    provide: NGX_CHANGE_SET_SERVICE,\n    useExisting: MyChangeSetService\n}'
            );
        }) as () => BaseChangeSetService
    }
);

/**
 * The body for the reset change set request.
 */
export interface ResetChangeSetBody {
    /**
     * The id of the change set to reset/rollback to.
     */
    changeSetId: string
}

/**
 * The body for the rollback change set request.
 */
export type RollbackChangeSetBody = ResetChangeSetBody;

/**
 * The base change set service.
 * Needs to be overridden and provided for the NGX_CHANGE_SET_SERVICE for the ChangeSetsComponent to work.
 */
export abstract class BaseChangeSetService {
    /**
     * The label for the reset button.
     *
     * @default 'Reset'
     */
    protected readonly resetButtonLabel: string = 'Reset';

    /**
     * The format for the created at date.
     *
     * @default 'dd.MM.yyyy HH:mm'
     */
    protected readonly dateFormat: string = 'dd.MM.yyyy HH:mm';

    /**
     * The format to use for the created at timestamp when on mobile devices.
     *
     * @default 'dd.MM.yyyy'
     */
    protected readonly shortDateFormat: string = 'dd.MM.yyyy';

    /**
     * The label for the reset button.
     *
     * @default true
     */
    protected readonly canOpenCreatedBy: boolean = true;

    /**
     * Whether or not a display value should be shown for an empty created by value.
     * You could eg. Display something like "System".
     *
     * @default false
     */
    protected readonly displayValueForEmptyCreatedBy: boolean = false;

    /**
     * The label for the label under which all keys are listed that have been changed.
     *
     * @default 'Property'
     */
    protected readonly changeKeyLabel: string = 'Property';

    /**
     * The label for the previous value of a change.
     *
     * @default 'Previous Value'
     */
    protected readonly previousValueLabel: string = 'Previous Value';

    /**
     * The label for the new value of a change.
     *
     * @default 'New Value'
     */
    protected readonly newValueLabel: string = 'New Value';

    /**
     * The configuration of the confirm dialog for resetting a change set.
     */
    protected readonly resetConfirmDialogData: ConfirmDialogData = {
        title: 'Confirmation',
        paragraphs: ['Do you really want to reset this change set?', 'This will delete the change set and can\'t be undone.'],
        confirmButtonLabel: 'Reset',
        cancelButtonLabel: 'Cancel'
    };

    /**
     * The configuration of the confirm dialog for rolling back to a change set.
     */
    protected readonly rollbackConfirmDialogData: ConfirmDialogData = {
        title: 'Confirmation',
        paragraphs: [
            'Do you really want to rollback the entity to the state before this change set?',
            'This will delete the change set and all newer ones and can\'t be undone.'
        ],
        confirmButtonLabel: 'Rollback',
        cancelButtonLabel: 'Cancel'
    };

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * The global default configuration for a change sets component.
     * Can be changed by either overriding the properties on this class or by using the "config" @Input on the component level.
     */
    get configuration(): ChangeSetsConfiguration {
        return {
            dateFormat: this.dateFormat,
            resetButtonLabel: this.resetButtonLabel,
            canOpenCreatedBy: this.canOpenCreatedBy,
            displayValueForEmptyCreatedBy: this.displayValueForEmptyCreatedBy,
            getDisplayValueForCreatedBy: changeSet => this.getDisplayValueForCreatedBy(changeSet),
            rollbackToChangeSet: (changeSet, changeSetsApiBaseUrl) => this.rollbackToChangeSet(changeSet, changeSetsApiBaseUrl),
            resetChangeSet: (changeSet, changeSetsApiBaseUrl) => this.resetChangeSet(changeSet, changeSetsApiBaseUrl),
            openCreatedBy: changeSet => this.openCreatedBy(changeSet),
            getOperationName: changeSet => this.getOperationName(changeSet),
            changeKeyLabel: this.changeKeyLabel,
            previousValueLabel: this.previousValueLabel,
            newValueLabel: this.newValueLabel,
            shortDateFormat: this.shortDateFormat,
            rollbackConfirmDialogData: this.rollbackConfirmDialogData,
            resetConfirmDialogData: this.resetConfirmDialogData
        };
    }

    constructor(protected readonly http: HttpClient) {}

    /**
     * Resets the given change set. All changes afterwards are kept.
     * By default this sends a POST request to `${changeSetsApiBaseUrl}/${changeSet.changeSetEntityId}/reset`.
     * The body contains the id of the change set to reset.
     * It expects the request to return the updated entity including its change sets to update the ui.
     *
     * @param changeSet - The change set to reset.
     * @param changeSetsApiBaseUrl - The api base url for the change sets.
     * This is not set in the method because resetting a change set might be different for each entity.
     * @returns The entity after the reset happened.
     */
    async resetChangeSet(changeSet: ChangeSet, changeSetsApiBaseUrl: string): Promise<ChangeSetEntity> {
        const body: ResetChangeSetBody = { changeSetId: changeSet.id };
        return await firstValueFrom(this.http.post<ChangeSetEntity>(`${changeSetsApiBaseUrl}/${changeSet.changeSetEntityId}/reset`, body));
    }

    /**
     * Rolls back the entity to the state before the given change set.
     * All change sets after after that state including this one are deleted.
     * By default this sends a POST request to `${changeSetsApiBaseUrl}/${changeSet.id}/rollback`.
     * It expects the request to return the updated entity including its change sets to update the ui.
     *
     * @param changeSet - The change set to rollback.
     * @param changeSetsApiBaseUrl - The api base url for the change sets.
     * This is not set in the method because rollbacks might be different for each entity.
     * @returns The entity after the rollback happened.
     */
    async rollbackToChangeSet(changeSet: ChangeSet, changeSetsApiBaseUrl: string): Promise<ChangeSetEntity> {
        const body: RollbackChangeSetBody = { changeSetId: changeSet.id };
        // eslint-disable-next-line max-len
        return await firstValueFrom(this.http.post<ChangeSetEntity>(`${changeSetsApiBaseUrl}/${changeSet.changeSetEntityId}/rollback`, body));
    }

    /**
     * How to display the "createdBy" in the component.
     *
     * @param changeSet - The change set.
     * @returns Simple the createdBy value by default.
     */
    getDisplayValueForCreatedBy(changeSet: ChangeSet): string {
        return changeSet.createdBy ?? '';
    }

    /**
     * What to do when the user clicks on the createdBy link and canOpenCreatedBy is enabled.
     *
     * @param changeSet - The change set.
     * @returns The type in uppercase by default.
     */
    getOperationName(changeSet: ChangeSet): string {
        // if (changeSet.type === ChangeSetType.REPLACE) {
        //     return `${ChangeSetType.UPDATE}`.toUpperCase();
        // }
        return `${changeSet.type}`.toUpperCase();
    }

    /**
     * Opens the createdBy value.
     * This is most likely used to display the user profile of the person that created the change.
     *
     * @param changeSet - The change set.
     */
    abstract openCreatedBy(changeSet: ChangeSet): Promise<void>;
}