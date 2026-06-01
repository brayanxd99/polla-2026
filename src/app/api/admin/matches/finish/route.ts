import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { calculatePoints } from "@/lib/scoring"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    // Only ADMIN can finish matches
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId, homeScore, awayScore } = await req.json()

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { predictions: true }
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status === "FINISHED") {
      return NextResponse.json({ error: "Match is already finished" }, { status: 400 })
    }

    // 1. Update Match status and actual score
    await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "FINISHED",
        homeScore,
        awayScore
      }
    })

    // 2. Process all predictions for this match
    for (const prediction of match.predictions) {
      const { points, isExact } = calculatePoints(
        prediction.homeScore,
        prediction.awayScore,
        homeScore,
        awayScore
      )

      // Update prediction record
      await prisma.prediction.update({
        where: { id: prediction.id },
        data: { pointsEarned: points }
      })

      // Update user stats
      await prisma.user.update({
        where: { id: prediction.userId },
        data: {
          totalPoints: { increment: points },
          exactMatches: isExact ? { increment: 1 } : undefined,
        }
      })
    }

    return NextResponse.json({ success: true, message: "Match finalized and points distributed" })
  } catch (error) {
    console.error("Error finalizing match:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic';
