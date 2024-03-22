// add 'scroll-visible' class if the element has scroll
import { AfterViewInit, Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
    selector: '[appScrollVisible]'
})
export class ScrollVisibleDirective implements AfterViewInit {
    @HostBinding('class.scroll-visible') scrollVisible = false;

    resizeObserver = new ResizeObserver(() => {
        setTimeout(() => {
            this.scrollVisible =
                this.el.nativeElement.clientHeight < this.el.nativeElement.scrollHeight;
            if (this.scrollVisible) {
                this.el.nativeElement.classList.add('scroll-visible');
            } else {
                this.el.nativeElement.classList.remove('scroll-visible');
            }
        }, 0);
    });

    constructor(public el: ElementRef) {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.scrollVisible =
                this.el.nativeElement.clientHeight < this.el.nativeElement.scrollHeight;
        }, 0);

        this.resizeObserver.observe(this.el.nativeElement);
    }
}
