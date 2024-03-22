import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LoginState } from '../layout/login-layout.component';
import { cloneDeep } from 'lodash';
import { MoodJournalService } from 'src/app/shared/services/mood-journal.service';
import { InOutScaleAnimation } from 'src/animations';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login.scss', './register.component.scss'],
  animations: [cloneDeep(InOutScaleAnimation)],
})
export class RegisterComponent {
  @Output() goToState = new EventEmitter<{
    username: string;
    state: LoginState;
  }>();
  loading: boolean;
  LOGIN_STATES = LoginState;
  passwordErrors = {
    AtLeastLength: 'At least 8 characters',
    AtLeastOneLower: 'At least one lowercase letter (a-z)',
    AtLeastOneNumber: 'At least one number (0-9)',
    AtLeastOneSpecial: 'At least one special character',
    AtLeastOneUpper: 'At least one uppercase letter(A-Z)',
  };

  registerForm = this.fb.group(
    {
      username: ['', [Validators.required]],
      password: ['', [Validators.required, passwordValidator(8, '$@!%*?&^#')]],
      passwordConfirm: [
        '',
        {
          validators: [Validators.required],
        },
      ],
    },
    {
      validators: [passwordsMatchingValidator('password', 'passwordConfirm')],
    }
  );

  constructor(
    private fb: FormBuilder,
    private moodJournalService: MoodJournalService
  ) {}

  signUp() {
    if (this.loading) {
      return;
    }

    this.registerForm.markAllAsTouched();
    this.registerForm.updateValueAndValidity();
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.moodJournalService
      .register(
        this.registerForm.get('username').value.toLowerCase(),
        this.registerForm.get('password').value
      )
      .pipe(
        catchError((error) => {
          if (error.error.message === 'The user is already registered')
            this.registerForm.setErrors({ UserAlreadyRegistered: true });
          else this.registerForm.setErrors({ ServerError: true });
          return of(null);
        })
      )
      .subscribe((user) => {
        this.loading = false;
        if (user) {
          this.goTo(LoginState.LOGIN);
        }
      });
  }

  goTo(state) {
    this.goToState.emit({
      username:
        state === LoginState.LOGIN
          ? null
          : this.registerForm.get('username').value,
      state,
    });
  }
  originalOrder = (a, b): number => {
    return 0;
  };
}

export function passwordsMatchingValidator(
  password: string,
  confirmPassword: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(password);
    const confirmPasswordControl = control.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (
      !!passwordControl.value &&
      !!confirmPasswordControl.value &&
      passwordControl.value !== confirmPasswordControl.value
    ) {
      if (
        control.get(password).touched &&
        control.get(confirmPassword).touched
      ) {
        [password, confirmPassword].forEach((ctrlName) => {
          control
            .get(ctrlName)
            .setErrors(
              { ...control.get(ctrlName).errors, PasswordsNotMatching: true },
              { emitEvent: false }
            );
        });
      }
      return { PasswordsNotMatching: true };
    } else {
      [password, confirmPassword].forEach((ctrlName) => {
        if (control.get(ctrlName).hasError('PasswordsNotMatching')) {
          const { PasswordsNotMatching, ...errors } =
            control.get(ctrlName).errors;
          control.get(ctrlName).setErrors(errors);
          control.get(ctrlName).updateValueAndValidity();
        }
      });
      return null;
    }
  };
}

export function passwordValidator(
  minLength: number,
  specialChars: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const rules = {
      AtLeastOneLower: '(?=.*[a-z])',
      AtLeastOneUpper: '(?=.*[A-Z])',
      AtLeastOneNumber: '(?=.*[0-9])',
      AtLeastOneSpecial: '(?=.*[' + specialChars + '])',
      AtLeastLength: '[A-Za-z0-9d' + specialChars + '].{' + minLength + ',}',
    };

    const errors = {};
    Object.keys(rules).forEach((key) => {
      const regEx = new RegExp(rules[key]);
      if (!regEx.test(value)) {
        errors[key] = true;
      } else {
        errors[key] = false;
      }
    });

    return Object.values(errors).some((r) => r)
      ? { ...errors, pattern: true }
      : null;
  };
}
