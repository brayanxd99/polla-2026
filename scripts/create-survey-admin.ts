import { prisma } from '../src/lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  const email = 'admin@encuestas.com'
  const password = await hash('870211', 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password,
      role: 'ADMIN',
      name: 'Administrador',
    },
    create: {
      email,
      password,
      role: 'ADMIN',
      name: 'Administrador',
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
