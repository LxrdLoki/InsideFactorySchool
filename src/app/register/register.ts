import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { matchPasswords } from '../regex/matchPasswords';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  public registerError = signal<string | null>(null);
  private formBuilder = inject(FormBuilder);

  constructor(public apiService: ApiService) { }

  public registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/) // for atleast 1 uppercase and 1 number
      ]
    ],
    confirmPassword: ['', [Validators.required]]
  }, { validators: matchPasswords });

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      this.registerError.set(null);
    });
  }

  public register(event: Event) {
    event.preventDefault();
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registerForm.value;


    this.apiService.registerUser(username!, email!, password!).subscribe({
      next: (response) => {
        window.location.href = '/login';
      },
      error: (err) => {
        console.error('Error registering user -> ', err.error.error);
        const errorMsg = err.error.error;
        this.registerError.set(errorMsg);

        if (errorMsg.includes("Username")) {
          this.registerForm.get('username')?.setErrors({ usernameTaken: true });
        } else if (errorMsg.includes("Email")) {
          this.registerForm.get('email')?.setErrors({ emailTaken: true });
        }
      }
    });
  }
}
