import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const FLAG_MAP: Record<string, string> = {
  'México': 'mx', 'Sudáfrica': 'za', 'República de Corea': 'kr', 'República Checa': 'cz',
  'Canadá': 'ca', 'Bosnia y Herzegovina': 'ba', 'Catar': 'qa', 'Suiza': 'ch',
  'Brasil': 'br', 'Marruecos': 'ma', 'Haití': 'ht', 'Escocia': 'gb-sct',
  'Estados Unidos': 'us', 'Paraguay': 'py', 'Australia': 'au', 'Turquía': 'tr',
  'Alemania': 'de', 'Curazao': 'cw', 'Costa de Marfil': 'ci', 'Ecuador': 'ec',
  'Países Bajos': 'nl', 'Japón': 'jp', 'Suecia': 'se', 'Túnez': 'tn',
  'Bélgica': 'be', 'Egipto': 'eg', 'RI de Irán': 'ir', 'Irán': 'ir', 'Nueva Zelanda': 'nz',
  'España': 'es', 'Cabo Verde': 'cv', 'Arabia Saudí': 'sa', 'Uruguay': 'uy',
  'Francia': 'fr', 'Senegal': 'sn', 'Irak': 'iq', 'Noruega': 'no',
  'Argentina': 'ar', 'Argelia': 'dz', 'Austria': 'at', 'Jordania': 'jo',
  'Portugal': 'pt', 'RD de Congo': 'cd', 'Uzbekistán': 'uz', 'Colombia': 'co',
  'Inglaterra': 'gb-eng', 'Croacia': 'hr', 'Ghana': 'gh', 'Panamá': 'pa'
}

const ROUND32_MATCHES = [
  { home: "Sudáfrica", away: "Canadá", time: "2026-06-28T14:00:00-05:00", stadium: "Estadio Los Angeles" },
  { home: "Brasil", away: "Japón", time: "2026-06-29T12:00:00-05:00", stadium: "Estadio Houston" },
  { home: "Alemania", away: "Paraguay", time: "2026-06-29T15:30:00-05:00", stadium: "Estadio Boston" },
  { home: "Países Bajos", away: "Marruecos", time: "2026-06-29T20:00:00-05:00", stadium: "Estadio Monterrey" },
  { home: "Costa de Marfil", away: "Noruega", time: "2026-06-30T12:00:00-05:00", stadium: "Estadio Dallas" },
  { home: "Francia", away: "Suecia", time: "2026-06-30T16:00:00-05:00", stadium: "Estadio Nueva York/Nueva Jersey" },
  { home: "México", away: "Ecuador", time: "2026-06-30T20:00:00-05:00", stadium: "Estadio Ciudad de México" },
  { home: "Inglaterra", away: "RD de Congo", time: "2026-07-01T11:00:00-05:00", stadium: "Estadio Atlanta" },
  { home: "Bélgica", away: "Senegal", time: "2026-07-01T15:00:00-05:00", stadium: "Estadio Seattle" },
  { home: "Estados Unidos", away: "Bosnia y Herzegovina", time: "2026-07-01T19:00:00-05:00", stadium: "Estadio de la Bahía de San Francisco" },
  { home: "España", away: "Austria", time: "2026-07-02T14:00:00-05:00", stadium: "Estadio Los Angeles" },
  { home: "Portugal", away: "Croacia", time: "2026-07-02T18:00:00-05:00", stadium: "Estadio de Toronto" },
  { home: "Suiza", away: "Argelia", time: "2026-07-02T22:00:00-05:00", stadium: "Estadio BC Place Vancouver" },
  { home: "Australia", away: "Egipto", time: "2026-07-03T13:00:00-05:00", stadium: "Estadio Dallas" },
  { home: "Argentina", away: "Cabo Verde", time: "2026-07-03T17:00:00-05:00", stadium: "Estadio Miami" },
  { home: "Colombia", away: "Ghana", time: "2026-07-03T20:30:00-05:00", stadium: "Estadio Kansas City" }
]

async function getOrCreateTeam(name: string): Promise<any> {
  let team = await prisma.team.findFirst({ where: { name } })
  if (!team) {
    console.log(`⚠️ Team not found in DB: ${name}. Creating...`)
    const flag = FLAG_MAP[name] || 'un'
    const code = (flag.length === 2 ? flag : name.substring(0, 3)).toUpperCase() + Math.floor(Math.random() * 100)
    team = await prisma.team.create({
      data: {
        name,
        code: code.substring(0, 5),
        group: '16avos',
        flagUrl: `https://flagcdn.com/w160/${flag}.png`
      }
    })
  }
  return team
}

export async function POST() {
  try {
    const session = await auth()
    
    // Check ADMIN permissions
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log("Seeding Round of 32 matches...")

    // Delete existing matches for "16avos de Final" to avoid duplicates/errors
    await prisma.match.deleteMany({
      where: { round: "16avos de Final" }
    })

    let createdCount = 0

    for (const m of ROUND32_MATCHES) {
      const homeTeam = await getOrCreateTeam(m.home)
      const awayTeam = await getOrCreateTeam(m.away)

      await prisma.match.create({
        data: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startTime: new Date(m.time),
          stadium: m.stadium,
          round: "16avos de Final",
          status: "PENDING"
        }
      })
      createdCount++
    }

    return NextResponse.json({
      success: true,
      message: `Partidos de 16avos creados exitosamente. Se agregaron ${createdCount} partidos nuevos.`
    })

  } catch (error) {
    console.error("Error seeding 16avos matches:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic';
