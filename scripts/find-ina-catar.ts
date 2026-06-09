import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function findMatch() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true
    }
  })
  
  const suspicious = matches.filter(m => 
    m.homeTeam.name.toLowerCase().includes('ina') || 
    m.awayTeam.name.toLowerCase().includes('ina') ||
    m.homeTeam.name.toLowerCase().includes('catar') ||
    m.awayTeam.name.toLowerCase().includes('catar') ||
    m.homeTeam.name.toLowerCase().includes('qatar') ||
    m.awayTeam.name.toLowerCase().includes('qatar')
  )
  
  console.log(JSON.stringify(suspicious, null, 2))
}

findMatch()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
