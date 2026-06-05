import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log("Corrgiendo horarios de los partidos (restando 1 hora para ajustar a Oficial FIFA)...")
  
  const matches = await prisma.match.findMany()
  
  let updated = 0
  for (const match of matches) {
    // Restamos 1 hora (1 * 60 * 60 * 1000 ms)
    const newTime = new Date(match.startTime.getTime() - 1 * 60 * 60 * 1000)
    
    await prisma.match.update({
      where: { id: match.id },
      data: { startTime: newTime }
    })
    updated++
  }
  
  console.log(`¡Se actualizaron exitosamente los horarios de ${updated} partidos!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
