import { ChangeSet, ChangeSetEntity } from '../../models';

/**
 * Data that gets displayed inside a confirmation dialog.
 */
export interface ConfirmDialogData {
    /**
     * The title of the dialog (optional).
     */
    title?: string,
    /**
     * The paragraphs to display inside the dialog.
     */
    paragraphs: string[],
    /**
     * The label of the confirm button.
     */
    confirmButtonLabel: string,
    /**
     * The label of the cancel button.
     */
    cancelButtonLabel: string
}

/**
 * The configuration for the ChangeSetsComponent.
 * A global configuration is provided by the ChangeSetService,
 * but you can also provide as an @Input.
 */
export interface ChangeSetsConfig {
    /**
     * The format to use for the created at timestamp.
     *
     * @default 'dd.MM.yyyy HH:mm'
     */
    dateFormat: string,
    /**
     * The format to use for the created at timestamp when on mobile devices.
     *
     * @default 'dd.MM.yyyy'
     */
    shortDateFormat: string,
    /**
     * Whether or not the "createdBy" can be clicked to eg. Navigate to a user that created the change set.
     *
     * @default true
     */
    canOpenCreatedBy: boolean,
    /**
     * Whether or not a display value should be shown for an empty created by value.
     * You could eg. Display something like "System".
     *
     * @default false
     */
    displayValueForEmptyCreatedBy: boolean,
    /**
     * The label for the reset button.
     *
     * @default 'Reset'
     */
    resetButtonLabel: string,
    /**
     * The label for the label under which all keys are listed that have been changed.
     *
     * @default 'Property'
     */
    changeKeyLabel: string,
    /**
     * The label for the previous value of a change.
     *
     * @default 'Previous Value'
     */
    previousValueLabel: string,
    /**
     * The label for the new value of a change.
     *
     * @default 'New Value'
     */
    newValueLabel: string,
    /**
     * How to display the "createdBy" in the component.
     *
     * @default simply return createdBy
     */
    getDisplayValueForCreatedBy: (changeSet: ChangeSet) => Promise<string>,
    /**
     * What to do when the user clicks on the "Rollback to this change set" button.
     *
     * @default Uses the service to send a request.
     */
    rollbackToChangeSet: (changeSet: ChangeSet, changeSetsApiBaseUrl: string) => Promise<ChangeSetEntity>,
    /**
     * What to do when the user clicks on the "Reset this change set" button.
     *
     * @default Uses the service to send a request.
     */
    resetChangeSet: (changeSet: ChangeSet, changeSetsApiBaseUrl: string) => Promise<ChangeSetEntity>,
    /**
     * What to do when the user clicks on the createdBy link and canOpenCreatedBy is enabled.
     */
    openCreatedBy: (changeSet: ChangeSet) => Promise<void>,
    /**
     * What to do when the user clicks on the createdBy link and canOpenCreatedBy is enabled.
     *
     * @default Returns the provided type in uppercase.
     */
    getOperationName: (changeSet: ChangeSet) => string,
    /**
     * The configuration of the confirm dialog for resetting a change set.
     */
    resetConfirmDialogData: ConfirmDialogData,
    /**
     * The configuration of the confirm dialog for rolling back to a change set.
     */
    rollbackConfirmDialogData: ConfirmDialogData
}