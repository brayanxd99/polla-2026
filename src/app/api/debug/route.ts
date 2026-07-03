import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let debugInfo: any = { status: "running" }
    
    // Check Prisma models available
    debugInfo.availablePrismaModels = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'))

    // Try finding QFPrediction using exact casing
    try {
      debugInfo.testQF = await (prisma as any).qFPrediction.count()
    } catch (e: any) {
      debugInfo.error_qFPrediction = e.message
    }

    try {
      debugInfo.test_qf = await (prisma as any).qfPrediction.count()
    } catch (e: any) {
      debugInfo.error_qfPrediction = e.message
    }

    return NextResponse.json({ success: true, debugInfo })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
  }
}
