/* eslint-disable jsdoc/require-jsdoc */
import { ChangeSetEntity } from 'ngx-material-change-sets';

export interface Address {
    street: string,
    number: string,
    postcode: string,
    city: string
}

export interface TestEntity extends ChangeSetEntity {
    firstName: string,
    lastName: string,
    address: Address,
    birthDay: Date,
    listItems?: string[]
}