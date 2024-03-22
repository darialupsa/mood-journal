import { LoginState } from '../layout/login-layout.component';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../login.scss', './login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Input() username: string;
  @Output() goToState = new EventEmitter<{
    username: string;
    state: LoginState;
  }>();
  loading: boolean;
  LOGIN_STATES = LoginState;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm.get('username').setValue(this.username || '');
  }

  signIn(): void {
    if (this.loading) {
      return;
    }
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.authService
      .signIn(
        this.loginForm.get('username').value,
        this.loginForm.get('password').value
      )
      .pipe(
        tap((user) => {
          if (!user) {
            this.loginForm.setErrors({ IncorrectUsernameOrPassword: true });
          }
        }),
        catchError(() => {
          this.loginForm.setErrors({ ServerError: true });
          return of(null);
        })
      )
      .subscribe((user) => {
        this.loading = false;
        if (user) this.router.navigate(['/home']);
      });
  }

  goTo(state) {
    this.goToState.emit({
      username: this.loginForm.get('username').value,
      state,
    });
  }

  resetForm(value?) {
    setTimeout(() => {
      this.formGroupDirective.resetForm();
      this.loginForm.reset(value || {}, { emitEvent: false });
    }, 0);
  }
}
