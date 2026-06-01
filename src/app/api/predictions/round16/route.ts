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

    if (!Array.isArray(teamIds) || teamIds.length !== 16) {
      return NextResponse.json({ error: "Debes enviar exactamente 16 equipos" }, { status: 400 })
    }

    // Opcional: Validar que el torneo no haya avanzado a una etapa donde ya no se puede predecir.
    // Asumiremos que pueden predecirlo hasta que los octavos estén confirmados.

    // Usamos una transacción para reemplazar las predicciones existentes
    await prisma.$transaction(async (tx: any) => {
      // Eliminar predicciones previas de R16
      await tx.round16Prediction.deleteMany({
        where: { userId: session.user.id }
      })

      // Insertar nuevas
      const predictionsToInsert = teamIds.map((teamId: string) => ({
        userId: session.user.id,
        teamId: teamId
      }))

      await tx.round16Prediction.createMany({
        data: predictionsToInsert
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[R16_PREDICTION_ERROR]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
