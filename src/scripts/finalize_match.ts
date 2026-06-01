import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { calculatePoints } from '../lib/scoring'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Fetching a PENDING match...")
  
  const match = await prisma.match.findFirst({
    where: { status: "PENDING" },
    include: { predictions: true, homeTeam: true, awayTeam: true }
  })

  if (!match) {
    console.log("No pending matches found.")
    return
  }

  console.log(`Finalizing match: ${match.homeTeam.code} vs ${match.awayTeam.code}`)
  
  const finalHomeScore = 2
  const finalAwayScore = 1

  console.log(`Final score will be: ${finalHomeScore} - ${finalAwayScore}`)

  // 1. Update Match status and actual score
  await prisma.match.update({
    where: { id: match.id },
    data: {
      status: "FINISHED",
      homeScore: finalHomeScore,
      awayScore: finalAwayScore
    }
  })

  // 2. Process all predictions for this match
  for (const prediction of match.predictions) {
    const { points, isExact } = calculatePoints(
      prediction.homeScore,
      prediction.awayScore,
      finalHomeScore,
      finalAwayScore
    )

    // Update prediction record
    await prisma.prediction.update({
      where: { id: prediction.id },
      data: { pointsEarned: points }
    })

    // Update user stats
    await prisma.user.update({
      where: { id: prediction.userId },
      data: {
        totalPoints: { increment: points },
        exactMatches: isExact ? { increment: 1 } : undefined,
      }
    })

    console.log(`User ${prediction.userId} earned ${points} points (Exact: ${isExact}) for predicting ${prediction.homeScore}-${prediction.awayScore}`)
  }

  console.log("Match finalized successfully.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
