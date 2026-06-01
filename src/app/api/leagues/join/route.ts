import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { inviteCode } = await req.json()

    if (!inviteCode || inviteCode.trim().length === 0) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
    }

    // Find the league
    const league = await prisma.league.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() }
    })

    if (!league) {
      return NextResponse.json({ error: "League not found" }, { status: 404 })
    }

    // Check if user is already a member
    const existingMember = await prisma.leagueMember.findUnique({
      where: {
        userId_leagueId: {
          userId: session.user.id,
          leagueId: league.id
        }
      }
    })

    if (existingMember) {
      return NextResponse.json({ error: "You are already a member of this league" }, { status: 400 })
    }

    // Add user to league
    await prisma.leagueMember.create({
      data: {
        userId: session.user.id,
        leagueId: league.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error joining league:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
