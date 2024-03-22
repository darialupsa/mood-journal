import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFunctionPipe' })
export class FunctionPipe implements PipeTransform {
    transform(date: string, fn): string {
        return fn(date);
    }
}
