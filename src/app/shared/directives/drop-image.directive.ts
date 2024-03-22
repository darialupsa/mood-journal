import {
  Directive,
  Output,
  EventEmitter,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appDropImage]',
})
export class DropImageDirective {
  @Output() filesDropped = new EventEmitter<File>();
  @Output() textDropped = new EventEmitter<string>();

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    let elem = evt.target;
    while (elem && elem != evt.currentTarget) {
      if (elem.classList.contains('not-allow-drop')) return;
      else elem = elem.parentElement;
    }

    evt.currentTarget.classList.add('drag-over');
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.currentTarget.classList.remove('drag-over');
  }

  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.currentTarget.classList.remove('drag-over');

    let elem = evt.target;
    while (elem && elem != evt.currentTarget) {
      if (elem.classList.contains('not-allow-drop')) return;
      else elem = elem.parentElement;
    }

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.filesDropped.emit(files[0]);
    } else {
      this.textDropped.emit(evt.dataTransfer.getData('text'));
    }
  }
}
