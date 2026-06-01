import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    // Solo ADMIN
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teamId, advanced } = await req.json()

    if (!teamId || advanced === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId }
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Actualizar estado del equipo
    await prisma.team.update({
      where: { id: teamId },
      data: { advancedToR16: advanced }
    })

    // Buscar predicciones sobre este equipo
    const predictions = await prisma.round16Prediction.findMany({
      where: { teamId }
    })

    const pointsToAward = advanced ? 5 : -5

    for (const pred of predictions) {
      // Solo sumamos/restamos si el estado cambió (para evitar doble puntaje si ya tenía los puntos y algo se desincroniza)
      // Si advanced = true y no tenía puntos asignados:
      if (advanced && pred.pointsEarned === null) {
        await prisma.round16Prediction.update({
          where: { id: pred.id },
          data: { pointsEarned: 5 }
        })
        await prisma.user.update({
          where: { id: pred.userId },
          data: { totalPoints: { increment: 5 } }
        })
      } 
      // Si advanced = false y tenía puntos asignados:
      else if (!advanced && pred.pointsEarned === 5) {
        await prisma.round16Prediction.update({
          where: { id: pred.id },
          data: { pointsEarned: null }
        })
        await prisma.user.update({
          where: { id: pred.userId },
          data: { totalPoints: { decrement: 5 } }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating team advancement:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
