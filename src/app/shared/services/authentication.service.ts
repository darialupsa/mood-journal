import { Injectable, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { MoodJournalService } from './mood-journal.service';
import { Observable, catchError, tap, pipe, of } from 'rxjs';
import { User } from '../model/mood-journal.model';

export function getUrlErrorMessage() {
  const error = window.location.search?.toLowerCase().includes('error')
    ? window.location.search
    : window.location.hash?.toLowerCase().includes('error')
    ? window.location.hash
    : null;
  return error ? decodeURIComponent(error).replace(/\+/g, ' ') : null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private router: Router,
    private moodJournalService: MoodJournalService
  ) {}

  signIn(username: string, password: string): Observable<User> {
    return this.moodJournalService.login(username, password).pipe(
      tap((user) => {
        if (user) {
          localStorage.setItem('AuthUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('AuthUser');
        }
      })
    );
  }

  signOut(): void {
    localStorage.removeItem('AuthUser');
    this.moodJournalService.clearStorage();
    this.navigateToLoginPage();
  }

  navigateToLoginPage(): Promise<boolean> {
    return this.router.navigate(['/login']);
  }

  public isAuthenticated(): Observable<boolean> {
    const authUser = localStorage.getItem('AuthUser');
    return authUser ? of(true) : of(false);
  }

  public getAuthUser() {
    return JSON.parse(localStorage.getItem('AuthUser')) as User;
  }
}
