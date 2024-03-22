import { Component, OnInit } from '@angular/core';
import { Anim1, Anim2 } from 'src/animations';
import { quotes } from 'src/assets/quotes';

@Component({
  selector: 'app-motivational-panel',
  templateUrl: './motivational-panel.component.html',
  styleUrls: ['./motivational-panel.component.scss'],
  animations: [Anim1, Anim2],
})
export class MotivationalPanelComponent implements OnInit {
  imagesCount = 35;
  imageIndex = 1;
  quotes = quotes;
  quoteIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.imageIndex = Math.floor(Math.random() * this.imagesCount) + 1;
    this.quoteIndex = Math.floor(Math.random() * this.quotes.length);
    setInterval(() => {
      this.updateImage();
    }, 10000);
  }

  updateImage(): void {
    const oldImageIndex = this.imageIndex;
    const oldQuoteIndex = this.quoteIndex;
    this.imageIndex = null;
    this.quoteIndex = null;

    setTimeout(() => {
      setTimeout(() => {
        let newImageIndex;
        do {
          newImageIndex = Math.floor(Math.random() * this.imagesCount) + 1;
        } while (oldImageIndex === newImageIndex);
        this.imageIndex = newImageIndex;

        setTimeout(() => {
          let newQuoteIndex;
          do {
            newQuoteIndex = Math.floor(Math.random() * this.quotes.length);
          } while (oldQuoteIndex === newQuoteIndex);

          this.quoteIndex = newQuoteIndex;
        }, 2000);
      }, 0);
    }, 3000);
  }
}
