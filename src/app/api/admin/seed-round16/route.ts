import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const ROUND16_MATCHES = [
  { home: "Paraguay", away: "Francia", time: "2026-07-04T17:00:00-05:00", stadium: "Estadio Filadelfia" },
  { home: "Canadá", away: "Marruecos", time: "2026-07-04T13:00:00-05:00", stadium: "Estadio Houston" },
  { home: "Brasil", away: "Noruega", time: "2026-07-05T16:00:00-05:00", stadium: "Estadio Nueva York Nueva Jersey" },
  { home: "México", away: "Inglaterra", time: "2026-07-05T20:00:00-05:00", stadium: "Estadio Ciudad de México" },
  { home: "Portugal", away: "España", time: "2026-07-06T15:00:00-05:00", stadium: "Estadio Dallas" },
  { home: "Estados Unidos", away: "Bélgica", time: "2026-07-06T20:00:00-05:00", stadium: "Estadio Seattle" },
  { home: "Ganador P86", away: "Egipto", time: "2026-07-07T12:00:00-05:00", stadium: "Estadio Atlanta" },
  { home: "Suiza", away: "Ganador P87", time: "2026-07-07T16:00:00-05:00", stadium: "Estadio BC Place Vancouver" }
]

async function getOrCreateTeam(name: string): Promise<any> {
  let code = name.substring(0, 3).toUpperCase()
  if (name === "Ganador P86") code = "P86"
  if (name === "Ganador P87") code = "P87"

  const existing = await prisma.team.findFirst({
    where: { name: name }
  })

  if (existing) return existing

  return await prisma.team.create({
    data: {
      name,
      code,
      group: "Octavos"
    }
  })
}

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Seeding Round of 16 matches...")

    // Delete existing matches for "Octavos de Final" to avoid duplicates/errors
    await prisma.match.deleteMany({
      where: { round: "Octavos de Final" }
    })

    let createdCount = 0

    for (const m of ROUND16_MATCHES) {
      const homeTeam = await getOrCreateTeam(m.home)
      const awayTeam = await getOrCreateTeam(m.away)

      await prisma.match.create({
        data: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startTime: new Date(m.time),
          stadium: m.stadium,
          round: "Octavos de Final",
          status: "PENDING"
        }
      })
      createdCount++
    }

    return NextResponse.json({
      message: `Successfully seeded ${createdCount} matches for Round of 16`
    })

  } catch (error: any) {
    console.error("Error seeding round of 16 matches:", error)
    return NextResponse.json(
      { error: "Failed to seed matches", details: error.message },
      { status: 500 }
    )
  }
}
