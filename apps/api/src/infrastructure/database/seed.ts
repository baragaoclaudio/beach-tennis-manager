import 'dotenv/config';
import argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { database, pool } from './connection.js';
import { users } from './schema.js';

const environmentSchema = z.object({
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12)
});

async function main() {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = environmentSchema.parse(process.env);
  const normalizedEmail = email.toLowerCase();
  const passwordHash = await argon2.hash(password);
  const [admin] = await database
    .insert(users)
    .values({
      id: randomUUID(),
      email: normalizedEmail,
      passwordHash,
      role: 'ADMIN',
      isActive: true,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash, role: 'ADMIN', isActive: true, updatedAt: new Date() }
    })
    .returning({ id: users.id, email: users.email, role: users.role });

  console.log(`Development administrator ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });