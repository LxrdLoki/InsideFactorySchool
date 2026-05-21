import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  public loginError = signal<string | null>(null);

  private formBuilder = inject(FormBuilder);


  constructor(public apiService: ApiService) { }

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.loginError.set(null);
    });
  }

  public login(event: Event) {
    event.preventDefault();

    if (this.loginForm.invalid) {
      console.error('Form is invalid -> ', this.loginForm.errors);
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.apiService.loginUser(email!, password!).subscribe({
      next: (response) => {
        localStorage.setItem("token", response.token);
        window.location.href = '/';
      },
      error: (err) => {
        console.error('Error logging in user -> ', err.error.error);
        this.loginError.set(err.error.error || 'Invalid email or password');
      }
    });
  }
}
