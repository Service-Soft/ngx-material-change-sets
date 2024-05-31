import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogData } from '../change-sets/change-sets-config.model';

/**
 * A generic dialog to either confirm or cancel an action.
 *
 * Confirm closes the dialog with "true", cancel closes it with "false".
 */
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, NgFor, NgIf]
})
export class ConfirmDialogComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly data: ConfirmDialogData,
        private readonly dialogRef: MatDialogRef<ConfirmDialogComponent>
    ) { }

    /**
     * Closes the dialog with "true".
     */
    confirm(): void {
        this.dialogRef.close(true);
    }

    /**
     * Closes the dialog with "false".
     */
    cancel(): void {
        this.dialogRef.close(false);
    }
}