import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')

  const adminEmail = 'admin@polla2026.com'
  const adminPassword = 'Admin2026*'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log(`Created admin user with id: ${admin.id}`)
  } else {
    console.log('Admin user already exists.')
  }

  console.log("Creando equipos...")
  const teamsData = [
    { name: "Argentina", code: "ARG", flagUrl: "https://flagcdn.com/w320/ar.png", group: "Grupo A" },
    { name: "Brasil", code: "BRA", flagUrl: "https://flagcdn.com/w320/br.png", group: "Grupo A" },
    { name: "Colombia", code: "COL", flagUrl: "https://flagcdn.com/w320/co.png", group: "Grupo B" },
    { name: "Francia", code: "FRA", flagUrl: "https://flagcdn.com/w320/fr.png", group: "Grupo B" },
    { name: "España", code: "ESP", flagUrl: "https://flagcdn.com/w320/es.png", group: "Grupo C" },
    { name: "Alemania", code: "GER", flagUrl: "https://flagcdn.com/w320/de.png", group: "Grupo C" },
    { name: "Estados Unidos", code: "USA", flagUrl: "https://flagcdn.com/w320/us.png", group: "Grupo D" },
    { name: "México", code: "MEX", flagUrl: "https://flagcdn.com/w320/mx.png", group: "Grupo D" },
  ]

  const teams = await Promise.all(
    teamsData.map(async (team) => {
      const existing = await prisma.team.findUnique({ where: { code: team.code } })
      if (!existing) {
        return prisma.team.create({ data: team })
      }
      return existing
    })
  )

  console.log("Equipos creados/validados exitosamente.")

  console.log("Creando partidos...")
  const getTeamId = (code: string) => teams.find(t => t.code === code)!.id
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  
  const inTwoDays = new Date(now)
  inTwoDays.setDate(now.getDate() + 2)

  const matchesData = [
    { homeTeamId: getTeamId("ARG"), awayTeamId: getTeamId("BRA"), startTime: tomorrow, round: "Fase de Grupos", status: "PENDING" as const },
    { homeTeamId: getTeamId("COL"), awayTeamId: getTeamId("FRA"), startTime: tomorrow, round: "Fase de Grupos", status: "PENDING" as const },
    { homeTeamId: getTeamId("ESP"), awayTeamId: getTeamId("GER"), startTime: inTwoDays, round: "Fase de Grupos", status: "PENDING" as const },
    { homeTeamId: getTeamId("USA"), awayTeamId: getTeamId("MEX"), startTime: inTwoDays, round: "Fase de Grupos", status: "PENDING" as const },
  ]

  const existingMatches = await prisma.match.count()
  if (existingMatches === 0) {
    await Promise.all(matchesData.map(match => prisma.match.create({ data: match })))
    console.log("Partidos creados exitosamente.")
  } else {
    console.log("Partidos ya existen, omitiendo.")
  }

  console.log('Seeding finished.')
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
