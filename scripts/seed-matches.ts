import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

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

const MONTHS: Record<string, string> = {
  'junio': '06',
  'julio': '07'
}

async function main() {
  console.log('Limpiando base de datos (Partidos y Equipos)...')
  await prisma.prediction.deleteMany()
  await prisma.match.deleteMany()
  await prisma.team.deleteMany()

  const filePath = path.join(process.cwd(), 'public', 'clasificaciones mundial 2026.txt')
  const content = fs.readFileSync(filePath, 'utf-8')

  const lines = content
    .replace(/[–—]/g, '-')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
  
  let currentGroup = ''
  
  const teamsToCreate = new Set<string>()
  const matchesToCreate: any[] = []

  // Regex to extract matches from a line.
  // Example: "15:00 - México v Sudáfrica - Grupo A - Estadio Ciudad de México"
  const matchRegex = /(\d{2}:\d{2})\s*-\s*(.+?)\s*v\s*(.+?)\s*-\s*Grupo\s*[A-L]\s*-\s*([^0-9]{5,}?)(?=\s*\d{2}:\d{2}\s*-|$)/g

  let currentDateStr = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('Grupo ')) {
      currentGroup = line
      continue
    }

    // Is it a team line? (Only letters, spaces, and no hyphens or numbers, except maybe dates but it follows "Grupo X")
    // Let's skip the team line since we can extract teams directly from matches
    if (!line.includes('-')) {
      continue
    }

    // Is it a date line?
    // Ex: "Jueves, 11 de junio 2026 15:00 - ..."
    // Wait, the date is at the beginning of the line!
    const dateMatch = line.match(/^[A-Za-záéíóú]+,\s*(\d{1,2})\s*de\s*([a-z]+)\s*2026\s*(.*)/i)
    let remainder = line
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0')
      const month = MONTHS[dateMatch[2].toLowerCase()]
      currentDateStr = `2026-${month}-${day}`
      remainder = dateMatch[3]
    }

    let matchObj
    while ((matchObj = matchRegex.exec(remainder)) !== null) {
      const time = matchObj[1]
      let home = matchObj[2].trim()
      let away = matchObj[3].trim()
      // Fix some typos if any like "República de Corea " -> "República de Corea"
      if (home.endsWith('-')) home = home.slice(0, -1).trim()
      if (away.endsWith('-')) away = away.slice(0, -1).trim()
      
      const stadium = matchObj[4].trim()

      teamsToCreate.add(home)
      teamsToCreate.add(away)

      // Time parsing
      // Assume UTC or local time? Just save as UTC for now.
      const startTime = new Date(`${currentDateStr}T${time}:00Z`)

      matchesToCreate.push({
        homeTeamName: home,
        awayTeamName: away,
        stadium: stadium,
        startTime: startTime,
        round: `Fase de Grupos - ${currentGroup}`
      })
    }
  }

  console.log('Equipos detectados:', teamsToCreate.size)
  const teamRecords: Record<string, any> = {}

  let teamIndex = 0
  for (const teamName of teamsToCreate) {
    const flag = FLAG_MAP[teamName] || 'un' // Unknown flag
    const code = (flag.length === 2 ? flag : teamName.substring(0, 3)).toUpperCase() + teamIndex
    teamIndex++
    
    const team = await prisma.team.create({
      data: {
        name: teamName,
        code: code.substring(0, 5), // Ensure it's short but unique
        group: 'Desconocido', // We can infer group from matches later or just leave it
        flagUrl: `https://flagcdn.com/w160/${flag}.png`
      }
    })
    teamRecords[teamName] = team
  }

  // Update teams' groups based on matches
  for (const match of matchesToCreate) {
    const homeTeam = teamRecords[match.homeTeamName]
    const awayTeam = teamRecords[match.awayTeamName]
    const groupName = match.round.replace('Fase de Grupos - ', '')
    
    if (homeTeam.group === 'Desconocido') {
      await prisma.team.update({ where: { id: homeTeam.id }, data: { group: groupName } })
      homeTeam.group = groupName
    }
    if (awayTeam.group === 'Desconocido') {
      await prisma.team.update({ where: { id: awayTeam.id }, data: { group: groupName } })
      awayTeam.group = groupName
    }
  }

  console.log('Creando partidos...', matchesToCreate.length)
  for (const match of matchesToCreate) {
    const homeTeam = teamRecords[match.homeTeamName]
    const awayTeam = teamRecords[match.awayTeamName]

    if (!homeTeam || !awayTeam) {
      console.error(`Team not found for match: ${match.homeTeamName} vs ${match.awayTeamName}`)
      continue
    }

    await prisma.match.create({
      data: {
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        startTime: match.startTime,
        stadium: match.stadium,
        round: match.round
      }
    })
  }

  console.log('¡Seeding completado con éxito basado en el archivo oficial!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
