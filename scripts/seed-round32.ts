import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

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
    console.log(`⚠️ Equipo no encontrado en BD: ${name}. Creándolo...`)
    const flag = FLAG_MAP[name] || 'un'
    // Generar un código único simple
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

async function main() {
  console.log('Iniciando creación de partidos de 16avos (Round of 32)...')
  let createdCount = 0

  for (const m of ROUND32_MATCHES) {
    const homeTeam = await getOrCreateTeam(m.home)
    const awayTeam = await getOrCreateTeam(m.away)

    // Verificar si el partido de 16avos ya existe para evitar duplicados
    const existingMatch = await prisma.match.findFirst({
      where: {
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        round: "16avos de Final"
      }
    })

    if (!existingMatch) {
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
      console.log(`✅ Partido creado: ${m.home} vs ${m.away} (${m.stadium})`)
      createdCount++
    } else {
      console.log(`ℹ️ Partido ya existe: ${m.home} vs ${m.away}`)
    }
  }

  console.log(`¡Seeding de 16avos completado! Se crearon ${createdCount} partidos nuevos.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
