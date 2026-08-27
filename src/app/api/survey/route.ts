import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const { ficha, instructor, aprendiz, salon, hasDropped, hasIssues, isSlow, novedad } = data

    if (!ficha || !instructor || !aprendiz || !salon) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
    }

    const response = await prisma.surveyResponse.create({
      data: {
        ficha,
        instructor,
        aprendiz,
        salon,
        hasDropped,
        hasIssues,
        isSlow,
        novedad
      }
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Survey submission error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
