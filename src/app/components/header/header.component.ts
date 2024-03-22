import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/model/mood-journal.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuOvered = false;
  user: User;
  profileImage: SafeUrl;

  constructor(
    private router: Router,
    public authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getAuthUser();
  }

  gotoHome() {
    this.router.navigate(['/']);
  }
  goTo(path: any) {
    this.router.navigate([`/${path}`]);
  }
  onMenuListOver(event: Event): void {
    event.stopPropagation();
    setTimeout(() => {
      this.menuOvered = true;
    }, 200);
  }

  onMenuListLeave(event: Event): void {
    event.stopPropagation();
    setTimeout(() => {
      this.menuOvered = false;
    }, 300);
  }
}
