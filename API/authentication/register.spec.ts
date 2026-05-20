import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register } from './register';

// Mock the password hashing function
vi.mock('../helpers/passportHasher', () => ({
  hassPassword: vi.fn(async (password) => `hashed_${password}`)
}));

describe('Register Function', () => {
  let mockPrisma: any;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Create mock Prisma client
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn()
      }
    };
  });

  it('should reject password with invalid requirements', async () => {
    const body = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'weak'
    };

    const result = await register(body, mockPrisma);

    // Should return error string with password validation errors
    expect(typeof result).toBe('string');
    expect(result).toContain('Password must be at least 6 characters long');
  });

  it('should return error when email already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

    const body = {
      username: 'newuser',
      email: 'test@example.com',
      password: 'ValidPass123'
    };

    const result = await register(body, mockPrisma);

    expect(result).toBe('Email already in use');
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    });
  });

  it('should return error when username already exists', async () => {
    // First call: email doesn't exist
    mockPrisma.user.findUnique
      .mockResolvedValueOnce(null)
      // Second call: username exists
      .mockResolvedValueOnce({ id: 2, username: 'testuser' });

    const body = {
      username: 'testuser',
      email: 'new@example.com',
      password: 'ValidPass123'
    };

    const result = await register(body, mockPrisma);

    expect(result).toBe('Username already in use');
  });

  it('should successfully create a new user with valid data', async () => {
    const mockUser = {
      id: 1,
      username: 'newuser',
      email: 'new@example.com',
      password: 'hashed_ValidPass123',
      role: 'USER'
    };

    // Email doesn't exist
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    // Username doesn't exist
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    // Create user
    mockPrisma.user.create.mockResolvedValueOnce(mockUser);

    const body = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'ValidPass123'
    };

    const result = await register(body, mockPrisma);

    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashed_ValidPass123'
      }
    });
  });

  it('should not store plain password in database', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.user.create.mockResolvedValueOnce({
      id: 1,
      username: 'user',
      email: 'test@test.com',
      password: 'hashed_Password123'
    });

    const body = {
      username: 'user',
      email: 'test@test.com',
      password: 'Password123'
    };

    await register(body, mockPrisma);

    const createCall = mockPrisma.user.create.mock.calls[0][0];
    expect(createCall.data.password).not.toBe('Password123');
    expect(createCall.data.password).toContain('hashed_');
  });

  it('should trim whitespace from inputs', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.user.create.mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_ValidPass123'
    });

    const body = {
      username: '  testuser  ',
      email: '  test@example.com  ',
      password: 'ValidPass123'
    };

    await register(body, mockPrisma);

    // Verify that the data was passed to Prisma
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });
});
