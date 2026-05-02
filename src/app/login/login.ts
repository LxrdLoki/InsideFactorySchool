import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(public apiService: ApiService) { }

  public login(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements[0] as HTMLInputElement).value;
    const password = (form.elements[1] as HTMLInputElement).value;

    this.apiService.loginUser(email, password).subscribe({
      next: (response) => {
        localStorage.setItem("token", response.token);
        console.log('logged in -> ', response);
      },
      error: (err) => {
        console.error('Error logging in user -> ', err);
      }
    });
  }
}
