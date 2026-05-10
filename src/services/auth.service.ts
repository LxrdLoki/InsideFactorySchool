import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  userId: number;
  role: string;
  exp: number;
};

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

  /**
   * this function validates the token by decoding it (savely)
   * and checking if the exp date is in the past or not
   * if the token is expired it will log out the user and return false
   */
  public validateToken(token: string): boolean {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      const ifExpired = decodedToken.exp * 1000 < Date.now();

      if (ifExpired) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token -> ', error);
      localStorage.removeItem('token');
      return false;
    }
  }

  /**
   * simple function that checks if the userId matches the userId of the resource
   * or if the user is an admin, this is used to check if the user can delete a post or comment
   * @param resourceUserId the userId of the resource (can be a comment or post)
   * @returns a boolean if user is owner or admin or not
   */
  public isOwnerOrAdmin(resourceUserId: number): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return Number(payload.userId) === resourceUserId || payload.role === 'ADMIN';
    } catch {
      return false;
    }
  }
}
