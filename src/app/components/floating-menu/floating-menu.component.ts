import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss'],
})
export class FloatingMenuComponent implements OnInit {
  @Input() toggleObject = { toggle: false };
  constructor() {}

  ngOnInit(): void {
    console.log(this.toggleObject);
  }
}
