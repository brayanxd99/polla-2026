import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Helper to generate a random 6-character code
function generateInviteCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await req.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate unique code
    let inviteCode = ""
    let isUnique = false
    while (!isUnique) {
      inviteCode = generateInviteCode()
      const existing = await prisma.league.findUnique({ where: { inviteCode } })
      if (!existing) isUnique = true
    }

    // Create league and add owner as member
    const league = await prisma.league.create({
      data: {
        name: name.trim(),
        inviteCode,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id
          }
        }
      }
    })

    return NextResponse.json({ success: true, league })
  } catch (error) {
    console.error("Error creating league:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
