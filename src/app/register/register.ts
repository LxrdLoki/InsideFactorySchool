import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  public registerError: string | null = null;

  constructor(public apiService: ApiService) { }

  public register(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements[0] as HTMLInputElement).value;
    const email = (form.elements[1] as HTMLInputElement).value;
    const password = (form.elements[2] as HTMLInputElement).value;


    this.apiService.registerUser(username, email, password).subscribe({
      next: (response) => {
        console.log('registerded -> ', response);
        window.location.href = '/login';
      },
      error: (err) => {
        console.error('Error registering user -> ', err);
        this.registerError = 'Error registering user, please try again';
      }
    });
  }
}
