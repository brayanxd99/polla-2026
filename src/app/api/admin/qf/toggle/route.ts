import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teamId, advanced } = await req.json()

    if (!teamId || typeof advanced !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } })
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })

    await prisma.$transaction(async (tx: any) => {
      // Update team status
      await tx.team.update({
        where: { id: teamId },
        data: { advancedToQF: advanced }
      })

      // Find all predictions for this team
      const predictions = await tx.quarterFinalPrediction.findMany({
        where: { teamId }
      })

      for (const pred of predictions) {
        if (advanced) {
          // Grant points if not already granted
          if (pred.pointsEarned === null) {
            await tx.quarterFinalPrediction.update({
              where: { id: pred.id },
              data: { pointsEarned: 5 }
            })
            await tx.user.update({
              where: { id: pred.userId },
              data: { totalPoints: { increment: 5 } }
            })
          }
        } else {
          // Revoke points if previously granted
          if (pred.pointsEarned === 5) {
            await tx.quarterFinalPrediction.update({
              where: { id: pred.id },
              data: { pointsEarned: null }
            })
            await tx.user.update({
              where: { id: pred.userId },
              data: { totalPoints: { decrement: 5 } }
            })
          }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ADMIN_QF_TOGGLE_ERROR]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
