
/**
 * Defines a single value change of an change set.
 */
export interface Change<T = unknown> {
    /**
     * The id of the change.
     */
    id: string,
    /**
     * The key of the value that has been changed.
     */
    key: string,
    /**
     * The value before it was changed.
     */
    previousValue?: T,
    /**
     * The value after it was changed.
     */
    newValue?: T,
    /**
     * The id of the change set that this change belongs to.
     */
    changeSetId: string
}