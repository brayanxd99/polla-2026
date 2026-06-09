import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function findTeam() {
  const teams = await prisma.team.findMany()
  
  const suspicious = teams.filter(t => 
    t.name.toLowerCase().includes('ina') ||
    t.name.toLowerCase().includes('catar') ||
    t.name.toLowerCase().includes('qatar') ||
    t.name.toLowerCase().includes('v')
  )
  
  console.log(JSON.stringify(suspicious, null, 2))
}

findTeam()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
