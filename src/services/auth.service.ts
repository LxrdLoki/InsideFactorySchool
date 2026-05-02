import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {

  // check if user is logged in
  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // check if user is admin
  public isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    //simple try catch to see if token role is admin if it fails (not admin or invalid token) return false
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ADMIN';
    } catch {
      return false;
    }
  }

  // check if user is normal user
  public isNormalUser(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'USER';
    } catch {
      return false;
    }
  }

  // logout user by deleting token and redirecting to dashboard page
  public logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
