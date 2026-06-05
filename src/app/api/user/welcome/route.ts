import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { hasSeenWelcome: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating welcome status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hasSeenWelcome: true }
    })

    return NextResponse.json({ hasSeenWelcome: user?.hasSeenWelcome || false })
  } catch (error) {
    console.error("Error fetching welcome status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
