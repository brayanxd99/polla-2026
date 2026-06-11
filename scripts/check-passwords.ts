import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { compare } from 'bcryptjs'

const usersToCheck = [
  { email: 'maria.barreto@asturias.edu.co', document: '1116279314' },
  { email: 'd.medina@asturias.edu.co', document: '1014308566' }
]

async function checkPasswords() {
  for (const user of usersToCheck) {
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (dbUser) {
      console.log(`User: ${user.email}`)
      const isMatch = await compare(user.document, dbUser.password || '')
      console.log(`Document matches password hash: ${isMatch}`)
      
      // Try to find if there is a trailing space or invisible character
      const isMatchWithSpace = await compare(user.document + ' ', dbUser.password || '')
      console.log(`Document + space matches: ${isMatchWithSpace}`)
    } else {
      console.log(`User not found: ${user.email}`)
    }
  }
}

checkPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
