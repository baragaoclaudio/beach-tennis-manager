import argon2 from 'argon2';
import type { PasswordVerifier } from '../../modules/auth/application/ports.js';

export const passwordVerifier: PasswordVerifier = {
  verify: (hash, password) => argon2.verify(hash, password)
};