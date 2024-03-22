import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

export enum LoginState {
  LOGIN,
  REGISTER,
}

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
})
export class LoginLayoutComponent implements OnInit {
  state: LoginState = LoginState.LOGIN;
  LOGIN_STATES = LoginState;
  username: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (await firstValueFrom(this.authService.isAuthenticated())) {
      this.router.navigate(['/home']);
    }
  }

  changeState(event: { username?: string; state?: LoginState }) {
    this.username = event.username || this.username;
    this.state = event.state;
  }
}
