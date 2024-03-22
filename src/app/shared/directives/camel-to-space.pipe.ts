import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'camelToSpace' })
export class CamelToSpacePipe implements PipeTransform {
  transform(text: string): string {
    if (!text || text.length <= 1 || text == 'CNP') return text;

    const result = text
      .split(/(?=[A-Z,Ş])/)
      .join(' ')
      .toLowerCase();
    return result
      ? result.charAt(0).toUpperCase() + result.substring(1).toLowerCase()
      : result;
  }
}

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(text: string): string {
    return text
      ? text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
      : text;
  }
}
