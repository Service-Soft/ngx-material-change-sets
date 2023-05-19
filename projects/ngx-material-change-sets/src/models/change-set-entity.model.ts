import { ChangeSet } from './change-set.model';

/**
 * An entity that can be handled by the CrudChangeSetRepository.
 * Has an uuid id and a relation to all its changeSets.
 */
export interface ChangeSetEntity {
    /**
     * The id of the changeset.
     */
    id: string,
    /**
     * All change sets.
     */
    changeSets: ChangeSet[]
}