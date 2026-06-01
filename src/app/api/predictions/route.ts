import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId, homeScore, awayScore } = await req.json()

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify match is still pending
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status !== "PENDING" || new Date(match.startTime) < new Date()) {
      return NextResponse.json({ error: "Match has already started or finished" }, { status: 400 })
    }

    // Upsert prediction
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId: session.user.id,
          matchId: matchId,
        },
      },
      update: {
        homeScore,
        awayScore,
      },
      create: {
        userId: session.user.id,
        matchId,
        homeScore,
        awayScore,
      },
    })

    return NextResponse.json({ success: true, prediction })
  } catch (error) {
    console.error("Error saving prediction:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
