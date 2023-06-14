import { AsyncPipe, DatePipe, KeyValue, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { ChangeSet, ChangeSetEntity, ChangeSetType } from '../../models';
import { BaseChangeSetService, NGX_CHANGE_SET_SERVICE } from '../../services/change-set.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ChangeSetsConfig } from './change-sets-config.model';

/**
 * A component that displays all change sets for the given @Input "entity".
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ngx-mat-change-sets',
    templateUrl: './change-sets.component.html',
    styleUrls: ['./change-sets.component.scss'],
    standalone: true,
    imports: [
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgFor,
        NgIf,
        MatExpansionModule,
        MatButtonModule,
        DatePipe,
        AsyncPipe,
        MatMenuModule,
        MatDialogModule,
        MatPaginatorModule
    ]
})
export class ChangeSetsComponent<Entity extends ChangeSetEntity, ChangeSetService extends BaseChangeSetService> implements OnInit {
    // eslint-disable-next-line jsdoc/require-jsdoc
    ChangeSetType: typeof ChangeSetType = ChangeSetType;

    // eslint-disable-next-line jsdoc/require-jsdoc
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    /**
     * The entity for which the change sets should be displayed.
     */
    @Input()
    set entity(value: Entity) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!value) {
            throw new Error('No "entity" has been provided.');
        }
        this.updateEntity(value);
        if (this.internalConfig != null) {
            void Promise.all(this.internalEntity.changeSets.map(async c => {
                return {
                    key: c.id,
                    value: await this.internalConfig.getDisplayValueForCreatedBy(c)
                };
            })).then(v => {
                this.createdByDisplayValues = v;
            });
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalEntity!: Entity;

    /**
     * The api base url for the change sets.
     * This is passed to the rollbacks and reset methods, to handle different entities.
     *
     * By default these methods send a request to
     * `${changeSetsApiBaseUrl}/${changeSet.id}/rollback` or `${changeSetsApiBaseUrl}/${changeSet.id}/reset`.
     */
    @Input()
    changeSetsApiBaseUrl?: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalChangeSetsApiBaseUrl!: string;

    /**
     * Configuration options for the component.
     *
     * These override the ones set by the ChangeSetService.
     */
    @Input()
    config?: Partial<ChangeSetsConfig>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalConfig!: ChangeSetsConfig;

    /**
     * The change sets that should actually be displayed on the current pagination index.
     */
    filteredChangeSets: ChangeSet[] = [];

    private pageSize: number = 10;

    private createdByDisplayValues: KeyValue<string, string>[] = [];

    constructor(
        @Inject(NGX_CHANGE_SET_SERVICE)
        private readonly changeSetService: ChangeSetService,
        private readonly dialog: MatDialog
    ) {}

    async ngOnInit(): Promise<void> {
        if (!this.changeSetsApiBaseUrl) {
            throw new Error('No "changeSetsApiBaseUrl" has been provided.');
        }
        this.internalChangeSetsApiBaseUrl = this.changeSetsApiBaseUrl;
        this.internalConfig = { ...this.changeSetService.configuration, ...this.config };
    }

    /**
     * Stops opening the expansion panel and then calls the openCreatedBy method when "canOpenCreatedBy" is enabled.
     *
     * @param event - The MouseEvent. Is needed to disable opening/closing of the expansion panel.
     * @param changeSet - The change set for which createdBy should be opened.
     */
    async openCreatedBy(event: MouseEvent, changeSet: ChangeSet): Promise<void> {
        event.stopPropagation();
        if (!this.internalConfig.canOpenCreatedBy) {
            return;
        }
        await this.internalConfig.openCreatedBy(changeSet);
    }

    /**
     * Resets the given change set using the method of the configuration.
     * The result is then used to update the entity.
     *
     * @param changeSet - The change set to reset.
     */
    async resetChangeSet(changeSet: ChangeSet): Promise<void> {
        const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> = this.dialog.open(ConfirmDialogComponent, {
            data: this.internalConfig.resetConfirmDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const confirmResult: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (confirmResult === true) {
            const updatedEntity: Entity = await this.internalConfig.resetChangeSet(changeSet, this.internalChangeSetsApiBaseUrl) as Entity;
            this.updateEntity(updatedEntity);
            this.paginator.pageIndex = 0;
        }
    }

    /**
     * Rolls back to the given change set using the method of the configuration.
     * The result is then used to update the entity.
     *
     * @param changeSet - The change set to rollback to.
     */
    async rollbackToChangeSet(changeSet: ChangeSet): Promise<void> {
        const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> = this.dialog.open(ConfirmDialogComponent, {
            data: this.internalConfig.rollbackConfirmDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const confirmResult: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (confirmResult === true) {
            // eslint-disable-next-line max-len
            const updatedEntity: Entity = await this.internalConfig.rollbackToChangeSet(changeSet, this.internalChangeSetsApiBaseUrl) as Entity;
            this.updateEntity(updatedEntity);
            this.paginator.pageIndex = 0;
        }
    }

    /**
     * Used by the ngFor to not rerender entries with the same id.
     *
     * @param index - The index of the element.
     * @param item - The actual change set element.
     * @returns The id of the change set, which is used to determine if two elements are equal.
     */
    trackById(index: number, item: ChangeSet): string {
        return item.id;
    }

    /**
     * Updates the entity and sorts the changesets descending by their creation date.
     *
     * @param updatedEntity - The new entity value.
     */
    private updateEntity(updatedEntity: Entity): void {
        updatedEntity.changeSets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.internalEntity = updatedEntity;
        this.filteredChangeSets = this.internalEntity.changeSets.slice(0, this.pageSize);
    }

    /**
     * Filters the entities change sets with the pagination event.
     *
     * @param event - The event from the paginator.
     */
    filterChangeSets(event: PageEvent): void {
        this.pageSize = event.pageSize;
        const from: number = event.pageIndex * event.pageSize;
        const until: number = event.pageIndex * event.pageSize + event.pageSize;
        this.filteredChangeSets = this.internalEntity.changeSets.slice(from, until);
    }

    /**
     * Gets the string to display for the created by value.
     * This encapsulates the functionality of the async configuration function.
     *
     * @param changeSet - The change set to get the display value for.
     * @returns Either the found display value of the local array or ''.
     */
    getDisplayValueForCreatedBy(changeSet: ChangeSet): string {
        return this.createdByDisplayValues.find(v => v.key === changeSet.id)?.value ?? '';
    }
}