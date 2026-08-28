import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const { ficha, instructor, aprendiz, correo, salon, network, seHaCaido, calificacion, intermitencia, novedad } = data

    if (!ficha || !instructor || !aprendiz || !correo || !salon || !calificacion) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
    }

    if (!correo.toLowerCase().endsWith("@sena.edu.co")) {
      return NextResponse.json({ error: "El correo debe ser @sena.edu.co" }, { status: 400 })
    }

    const response = await prisma.surveyResponse.create({
      data: {
        ficha,
        instructor,
        aprendiz,
        correo,
        salon,
        network,
        seHaCaido: Boolean(seHaCaido),
        calificacion,
        intermitencia: Boolean(intermitencia),
        novedad
      }
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Survey submission error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
