import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function updateMatch(home: string, away: string, newDateIso: string) {
  // Encontramos los ids de los equipos
  const homeTeam = await prisma.team.findFirst({ where: { name: home } })
  const awayTeam = await prisma.team.findFirst({ where: { name: away } })

  if (!homeTeam || !awayTeam) {
    console.log(`❌ No se encontraron los equipos: ${home} o ${away}`)
    return
  }

  // Encontramos el partido
  const match = await prisma.match.findFirst({
    where: {
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id
    }
  })

  if (!match) {
    console.log(`❌ No se encontró el partido entre: ${home} y ${away}`)
    return
  }

  // Actualizamos el horario
  await prisma.match.update({
    where: { id: match.id },
    data: { startTime: new Date(newDateIso) }
  })

  console.log(`✅ Partido actualizado: ${home} vs ${away} -> ${newDateIso}`)
}

async function main() {
  console.log("Actualizando horarios específicos de partidos...")
  
  // Las fechas se ingresan en formato ISO con el timezone -05:00 para que coincidan con la hora local de Colombia.
  // 1. australia vs turquia 13 de junio a las 11:00 pm
  await updateMatch("Australia", "Turquía", "2026-06-13T23:00:00-05:00")
  
  // 2. austria vs jordania 16 de junio a las 11:00 pm
  await updateMatch("Austria", "Jordania", "2026-06-16T23:00:00-05:00")
  
  // 3. turquia vs paraguay 19 de junio 10:00 pm
  await updateMatch("Turquía", "Paraguay", "2026-06-19T22:00:00-05:00")
  
  // 4. brasil vs haiti (solo es cambiarle la hora ) 7:30 pm (Asumo 19 de junio según el archivo original)
  await updateMatch("Brasil", "Haití", "2026-06-19T19:30:00-05:00")
  
  // 5. tunez vs japon 20 de junio 11:00 pm
  await updateMatch("Túnez", "Japón", "2026-06-20T23:00:00-05:00")

  console.log("¡Actualización completada!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
