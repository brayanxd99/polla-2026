import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('Admin2026*', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@polla2026.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@polla2026.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  
  console.log('Admin user created/updated:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
