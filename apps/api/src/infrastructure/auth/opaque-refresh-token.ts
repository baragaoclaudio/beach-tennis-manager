import { randomBytes } from 'node:crypto';
import type { OpaqueTokenGenerator } from '../../modules/auth/application/ports.js';

export const opaqueRefreshTokenGenerator: OpaqueTokenGenerator = {
  generate: () => randomBytes(32).toString('hex')
};
