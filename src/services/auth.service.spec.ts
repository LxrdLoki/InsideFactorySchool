import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJVU0VSIiwiZXhwIjo5OTk5OTk5OTk5fQ.fake';
  const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBRE1JTiIsImV4cCI6OTk5OTk5OTk5OX0.fake';
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJVU0VSIiwiZXhwIjoxNjAwMDAwMDAwfQ.fake';

  beforeEach(() => {
    authService = new AuthService();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isLoggedIn', () => {
    it('should return false when no token in localStorage', () => {
      expect(authService.isLoggedIn()).toBe(false);
    });

    it('should return true when token exists in localStorage', () => {
      localStorage.setItem('token', validToken);
      expect(authService.isLoggedIn()).toBe(true);
    });

    it('should return false when token is empty string', () => {
      localStorage.setItem('token', '');
      expect(authService.isLoggedIn()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return false when no token exists', () => {
      expect(authService.isAdmin()).toBe(false);
    });

    it('should return true when token has ADMIN role', () => {
      localStorage.setItem('token', adminToken);
      expect(authService.isAdmin()).toBe(true);
    });

    it('should return false when token has USER role', () => {
      localStorage.setItem('token', validToken);
      expect(authService.isAdmin()).toBe(false);
    });

    it('should return false when token is invalid/malformed', () => {
      localStorage.setItem('token', 'invalid.token.here');
      expect(authService.isAdmin()).toBe(false);
    });

    it('should return false when token has no role field', () => {
      const noRoleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.fake';
      localStorage.setItem('token', noRoleToken);
      expect(authService.isAdmin()).toBe(false);
    });
  });

  describe('isNormalUser', () => {
    it('should return false when no token exists', () => {
      expect(authService.isNormalUser()).toBe(false);
    });

    it('should return true when token has USER role', () => {
      localStorage.setItem('token', validToken);
      expect(authService.isNormalUser()).toBe(true);
    });

    it('should return false when token has ADMIN role', () => {
      localStorage.setItem('token', adminToken);
      expect(authService.isNormalUser()).toBe(false);
    });

    it('should return false when token is invalid/malformed', () => {
      localStorage.setItem('token', 'invalid.token.here');
      expect(authService.isNormalUser()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', validToken);

      // Mock window.location.href to prevent actual redirect
      delete (window as any).location;
      (window as any).location = { href: '' };

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should redirect to homepage after logout', () => {
      localStorage.setItem('token', validToken);

      delete (window as any).location;
      (window as any).location = { href: '' };

      authService.logout();

      expect((window as any).location.href).toBe('/');
    });
  });

  describe('validateToken', () => {
    it('should return false for expired token', () => {
      expect(authService.validateToken(expiredToken)).toBe(false);
    });

    it('should return true for valid token with future expiry', () => {
      expect(authService.validateToken(validToken)).toBe(true);
    });

    it('should return false for invalid token', () => {
      expect(authService.validateToken('invalid')).toBe(false);
    });

    it('should return false for malformed token', () => {
      expect(authService.validateToken('not.a.valid.jwt')).toBe(false);
    });
  });

  describe('isOwnerOrAdmin', () => {
    it('should return true if user is owner of resource', () => {
      localStorage.setItem('token', validToken);
      expect(authService.isOwnerOrAdmin(1)).toBe(true);
    });

    it('should return false if user is not owner of resource', () => {
      localStorage.setItem('token', validToken);
      expect(authService.isOwnerOrAdmin(999)).toBe(false);
    });

    it('should return true if user is admin regardless of resource ownership', () => {
      localStorage.setItem('token', adminToken);
      expect(authService.isOwnerOrAdmin(999)).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(authService.isOwnerOrAdmin(1)).toBe(false);
    });

    it('should return false for invalid token', () => {
      localStorage.setItem('token', 'invalid.token.here');
      expect(authService.isOwnerOrAdmin(1)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle token with missing parts gracefully', () => {
      localStorage.setItem('token', 'only.two');
      expect(authService.isAdmin()).toBe(false);
      expect(authService.isLoggedIn()).toBe(true);
    });

    it('should handle corrupted base64 payload', () => {
      localStorage.setItem('token', 'header.!!!corrupted.signature');
      expect(authService.isAdmin()).toBe(false);
      expect(authService.isNormalUser()).toBe(false);
    });
  });
});
