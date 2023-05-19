import { ChangeSetType } from './change-set-type.enum';
import { Change } from './change.model';

/**
 * A single change set.
 * Contains information about WHO, WHEN and WHAT was changed on the entity it belongs to.
 */
export interface ChangeSet {
    /**
     * The id of the changeset.
     */
    id: string,
    /**
     * Whether this change set was initialized on creating, updating or deleting the entity.
     */
    type: ChangeSetType,
    /**
     * The time at which the change happened.
     */
    createdAt: Date,
    /**
     * The id of the user that changed something.
     */
    createdBy?: string,
    /**
     * The things that have been changed.
     */
    changes: Change[],
    /**
     * The id of the related entity that this change set belongs to.
     */
    changeSetEntityId: string
}