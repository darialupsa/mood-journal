import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      `textImage`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/icons/text-image.svg`
      )
    );

    this.matIconRegistry.addSvgIcon(
      `download`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/icons/download.svg`
      )
    );

    this.matIconRegistry.addSvgIcon(
      `cloudUpload`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/icons/cloudUpload.svg`
      )
    );

    this.matIconRegistry.addSvgIcon(
      `image`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/icons/image.svg`
      )
    );

    this.matIconRegistry.addSvgIcon(
      `main-image`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/icons/main-image.svg`
      )
    );

    this.matIconRegistry.addSvgIcon(
      `rad_icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/emotions/rad.svg`
      )
    );

    this.matIconRegistry.addSvgIcon(
      `good_icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/emotions/good.svg`
      )
    );

    this.matIconRegistry.addSvgIcon(
      `meh_icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/emotions/meh.svg`
      )
    );
    this.matIconRegistry.addSvgIcon(
      `bad_icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/emotions/bad.svg`
      )
    );
    this.matIconRegistry.addSvgIcon(
      `awful_icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `../assets/emotions/awful.svg`
      )
    );
  }
}
