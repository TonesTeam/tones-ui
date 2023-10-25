import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value || typeof value !== 'object') return value;

        const newValue = { ...value };
        for (let key in newValue) {
            if (!newValue.hasOwnProperty(key)) continue;

            let item = newValue[key];
            if (typeof item === 'string' && /\d{4}-\d{2}-\d{2}/.test(item) ) {
                newValue[key] = new Date(item);
            }
        }

        return newValue;
    }
}