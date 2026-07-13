import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const SEMIFINAL_MATCHES = [
  { home: "Francia", away: "España", time: "2026-07-14T14:00:00-05:00", stadium: "Estadio Dallas" },
  { home: "Inglaterra", away: "Argentina", time: "2026-07-15T14:00:00-05:00", stadium: "Estadio Atlanta" }
]

async function getOrCreateTeam(name: string): Promise<any> {
  let code = name.substring(0, 3).toUpperCase()

  const existing = await prisma.team.findFirst({
    where: { name: name }
  })

  if (existing) return existing

  return await prisma.team.create({
    data: {
      name,
      code,
      group: "Semifinal"
    }
  })
}

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Seeding Semifinal matches...")

    // Delete existing matches for "Semifinal" to avoid duplicates
    await prisma.match.deleteMany({
      where: { round: "Semifinal" }
    })

    let createdCount = 0

    for (const m of SEMIFINAL_MATCHES) {
      const homeTeam = await getOrCreateTeam(m.home)
      const awayTeam = await getOrCreateTeam(m.away)

      await prisma.match.create({
        data: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startTime: new Date(m.time),
          stadium: m.stadium,
          round: "Semifinal",
          status: "PENDING"
        }
      })
      createdCount++
    }

    return NextResponse.json({
      message: `Successfully seeded ${createdCount} matches for Semifinals`
    })

  } catch (error: any) {
    console.error("Error seeding semifinal matches:", error)
    return NextResponse.json(
      { error: "Failed to seed matches", details: error.message },
      { status: 500 }
    )
  }
}
