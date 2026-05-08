import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(private authService: AuthService) { }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public logout(): void {
    this.authService.logout();
  }
}
