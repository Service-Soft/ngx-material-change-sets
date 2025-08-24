import { formatDate } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { ValueType } from '../models';

/**
 * A pipe that pretty prints any value. Should be used with a <pre> element.
 */
@Pipe({
    name: 'changeValue',
    standalone: true
})
export class ChangeValuePipe implements PipeTransform {

    constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    // eslint-disable-next-line jsdoc/require-jsdoc
    transform(value: unknown, format: string): unknown {
        if (value == undefined) {
            return '-';
        }
        switch (this.typeOfChange(value)) {
            case ValueType.OBJECT: {
                return JSON.stringify(value, undefined, 1);
            }
            case ValueType.DATE: {
                return formatDate(value as Date, format, this.locale);
            }
            case ValueType.ARRAY: {
                return this.formatArray(value as unknown[]);
            }
            case ValueType.OTHER: {
                return value;
            }
        }
    }

    private formatArray(value: unknown[]): string {
        if (value.length && typeof value[0] == 'object') {
            return JSON.stringify(value, undefined, 2);
        }
        let result: string = JSON.stringify(value, undefined, 1);
        result = result.replaceAll(/^ +/gm, ' '); // remove all but the first space for each line
        result = result.replaceAll('\n', ''); // remove line-breaks
        result = result.replaceAll('{ ', '{').replaceAll(' }', '}'); // remove spaces between object-braces and first/last props
        result = result.replaceAll('[ ', '[').replaceAll(' ]', ']'); // remove spaces between array-brackets and first/last items
        return result;
    }

    private typeOfChange(value: unknown): ValueType {
        if (typeof value == 'string') {
            try {
                const date: Date = new Date(value);
                if (date.toString() !== 'Invalid Date') {
                    return ValueType.DATE;
                }
            }
            catch {}
            return ValueType.OTHER;
        }
        if (typeof value != 'object') {
            return ValueType.OTHER;
        }
        if (Array.isArray(value)) {
            return ValueType.ARRAY;
        }
        return ValueType.OBJECT;
    }
}