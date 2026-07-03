import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { teamIds } = body

    if (!Array.isArray(teamIds) || teamIds.length !== 8) {
      return NextResponse.json({ error: "Debes enviar exactamente 8 equipos" }, { status: 400 })
    }

    // Check if predictions already exist
    const existingPredictions = await prisma.quarterFinalPrediction.count({
      where: { userId: session.user.id }
    })

    if (existingPredictions > 0) {
      return NextResponse.json({ error: "Ya guardaste tus 8 clasificados y no se pueden modificar" }, { status: 400 })
    }

    // Insertar nuevas
    await prisma.$transaction(async (tx: any) => {
      const predictionsToInsert = teamIds.map((teamId: string) => ({
        userId: session.user.id,
        teamId: teamId
      }))

      await tx.quarterFinalPrediction.createMany({
        data: predictionsToInsert
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[QF_PREDICTION_ERROR]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
