import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function deleteInaCatar() {
  const teamId = "cmpx891e90009dw2pbltrock2"
  
  // First, find and delete any matches involving this team
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ]
    }
  })
  
  if (matches.length > 0) {
    console.log(`Found ${matches.length} matches to delete.`)
    await prisma.match.deleteMany({
      where: {
        id: { in: matches.map(m => m.id) }
      }
    })
    console.log("Matches deleted.")
  }
  
  // Then delete the team itself
  await prisma.team.delete({
    where: { id: teamId }
  })
  console.log("Team 'ina v Catar' successfully deleted.")
}

deleteInaCatar()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
