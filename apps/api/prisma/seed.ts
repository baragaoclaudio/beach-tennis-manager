import 'dotenv/config';
import argon2 from 'argon2';
import { z } from 'zod';
import { prisma } from '../src/infrastructure/database/prisma-client.js';

const environmentSchema = z.object({
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12)
});

async function main() {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = environmentSchema.parse(process.env);
  const passwordHash = await argon2.hash(password);

  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      passwordHash,
      role: 'ADMIN',
      isActive: true
    },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      role: 'ADMIN',
      isActive: true
    },
    select: { id: true, email: true, role: true }
  });

  console.log(`Development administrator ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });