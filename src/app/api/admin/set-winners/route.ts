import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    
    // Seguridad: Solo el administrador puede ejecutar esto
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // 1. Buscar los IDs reales de las selecciones en la base de datos
    const argentina = await prisma.team.findFirst({ where: { name: { contains: "Argentina" } } })
    const colombia = await prisma.team.findFirst({ where: { name: { contains: "Colombia" } } })
    const egipto = await prisma.team.findFirst({ where: { name: { contains: "Egipt" } } })
    const suiza = await prisma.team.findFirst({ where: { name: { contains: "Suiza" } } })

    if (!argentina || !colombia || !egipto || !suiza) {
      return NextResponse.json({ error: "No se encontraron algunos equipos en la BD" }, { status: 404 })
    }

    // 2. Buscar el partido 95 (donde juega Egipto)
    const match95 = await prisma.match.findFirst({
      where: { 
        round: 'Octavos de Final',
        OR: [
          { homeTeamId: egipto.id },
          { awayTeamId: egipto.id }
        ]
      }
    })

    // Reemplazar al equipo temporal por Argentina
    if (match95) {
      const updateData: any = {}
      if (match95.homeTeamId !== egipto.id) updateData.homeTeamId = argentina.id
      if (match95.awayTeamId !== egipto.id) updateData.awayTeamId = argentina.id
      
      await prisma.match.update({
        where: { id: match95.id },
        data: updateData
      })
    }

    // 3. Buscar el partido 96 (donde juega Suiza)
    const match96 = await prisma.match.findFirst({
      where: { 
        round: 'Octavos de Final',
        OR: [
          { homeTeamId: suiza.id },
          { awayTeamId: suiza.id }
        ]
      }
    })

    // Reemplazar al equipo temporal por Colombia
    if (match96) {
      const updateData: any = {}
      if (match96.homeTeamId !== suiza.id) updateData.homeTeamId = colombia.id
      if (match96.awayTeamId !== suiza.id) updateData.awayTeamId = colombia.id
      
      await prisma.match.update({
        where: { id: match96.id },
        data: updateData
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "¡Los partidos se actualizaron exitosamente con Argentina y Colombia! Las predicciones de los usuarios están intactas." 
    })

  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
